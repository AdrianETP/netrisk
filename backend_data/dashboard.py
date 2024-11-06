from pymongo import MongoClient
from flask import jsonify
from datetime import datetime

# Configura la conexión con MongoDB
client = MongoClient('mongodb://mymongo:27017/')
db = client['local']  # Nombre de base de datos
print(db.list_collection_names())

# Función para serializar documentos y convertir ObjectId a cadena
def serialize_document(document):
    if '_id' in document:
        document['_id'] = str(document['_id'])
    return document


def calculate_netscore():
    try:
        auditorias_collection = db['auditorias']

        # Obtener ultima auditoria completada
        auditoria = auditorias_collection.find_one({"estado": "Completada"}, sort=[("fecha", -1)])

        # Obtener el puntaje de los controles implementados
        controles_implementados = get_implemented_controls(db)

        # Obtener la cobertura de roles cumplidos
        cobertura_roles = get_role_coverage(db)


        # Definir los puntajes negativos según la gravedad de la vulnerabilidad
        impact_scores = {
            "Crítico": -10,
            "Alto": -7,
            "Medio": -3,
            "Bajo": -1
        }
        
        # Variables de cálculo para el NetScore
        vt_score = 0  # Puntaje de vulnerabilidades técnicas
        vo_score = 0  # Puntaje de vulnerabilidades organizacionales

        # Calcular el impacto total de las vulnerabilidades técnicas
        for vulnerabilidad in auditoria['vulnerabilidades']['tecnicas']:
            impact = vulnerabilidad['impact']
            vt_score += impact_scores.get(impact, 0)  # Sumar el puntaje según la gravedad

        # Calcular el impacto total de las vulnerabilidades organizacionales
        for vulnerabilidad in auditoria['vulnerabilidades']['organizacionales']:
            impact = vulnerabilidad['impact']
            vo_score += impact_scores.get(impact, 0)  # Sumar el puntaje según la gravedad

        # Calcular la efectividad de los controles implementados (Ci)
        ci_score = sum(controles_implementados)  # Puntaje acumulado de controles implementados

        # Calcular la cobertura de controles (Cc)
        controles_totales = 100  # Ajusta este valor al número total de controles esperados en tu caso
        cc_score = (len(controles_implementados) / controles_totales) * 100

        # Calcular la cobertura de roles (Cr)
        cr_score = cobertura_roles  # Cobertura de roles en porcentaje, por ejemplo, 80%

        # Calcular el NetScore final
        netscore = 100 + (vt_score + vo_score) + (ci_score * 0.4) + (cc_score * 0.4) + (cr_score * 0.2)

        # Asegurarse de que el NetScore no exceda 100
        netscore = min(netscore, 100)

        # Get today's date
        fecha_hoy = datetime.now().strftime("%Y-%m-%d")

        # Save the result in the netscore collection
        db["netscore"].update_one(
            {"fecha": fecha_hoy},
            {"$set": {"netscore": netscore, "fecha": fecha_hoy}},
            upsert=True
        )

        return netscore
    
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

# Función para obtener los controles implementados desde MongoDB
def get_implemented_controls(db):
    # Filtra los controles que están implementados
    controles_implementados = db['controles'].find({"state": "Implementado"})
    
    # Calcular el puntaje total de los controles implementados
    controles_score = [5 for _ in controles_implementados]  # Asigna un puntaje fijo (p.ej. 10) por control
    return controles_score

# Función para obtener la cobertura de roles cumplidos
def get_role_coverage(db):
    roles_totales = db['roles'].count_documents({})  # Total de roles
    roles_cumplidos = db['roles'].count_documents({"status": "Cumplido"})  # Roles con estado "Cumplido"
    
    # Calcular el porcentaje de roles cumplidos
    if roles_totales > 0:
        return (roles_cumplidos / roles_totales) * 100
    return 0


# 1. Calcular total de vulnerabilidades por categoría de impacto
def calcular_vulnerabilidades_por_impacto():
    try:
        vulnerabilidades_tecnicas = db["auditorias"].aggregate([
            {"$unwind": "$vulnerabilidades.tecnicas"},
            {"$group": {"_id": "$vulnerabilidades.tecnicas.impact", "count": {"$sum": 1}}}
        ])
        
        vulnerabilidades_organizacionales = db["auditorias"].aggregate([
            {"$unwind": "$vulnerabilidades.organizacionales"},
            {"$group": {"_id": "$vulnerabilidades.organizacionales.impact", "count": {"$sum": 1}}}
        ])

        resultado_tecnicas = {item["_id"]: item["count"] for item in vulnerabilidades_tecnicas}
        resultado_organizacionales = {item["_id"]: item["count"] for item in vulnerabilidades_organizacionales}

        resultado = {
            "tecnicas": resultado_tecnicas,
            "organizacionales": resultado_organizacionales
        }
        
        # Guardar el resultado en una colección de estadísticas
        db["estadisticas"].update_one(
            {"_id": "vulnerabilidades_por_impacto"},
            {"$set": {"data": resultado}},
            upsert=True
        )
        return resultado
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

# 3. Calcular porcentaje de remediación de vulnerabilidades
def calcular_porcentaje_remediacion():
    try:
        # Obtener auditorías ordenadas cronológicamente por fecha
        auditorias = list(db["auditorias"].find().sort("fecha", 1))
        
        if len(auditorias) < 2:
            print("Se necesitan al menos dos auditorías para calcular la remediación.")
            return 0

        porcentajes_remediacion = []

        # Iterar sobre auditorías consecutivas
        for i in range(1, len(auditorias)):
            auditoria_actual = auditorias[i]
            auditoria_anterior = auditorias[i - 1]

            # Obtener IDs de vulnerabilidades de ambas auditorías
            vulnerabilidades_previas = set(vuln["id"] for vuln in auditoria_anterior.get("vulnerabilidades", {}).get("tecnicas", []))
            vulnerabilidades_actuales = set(vuln["id"] for vuln in auditoria_actual.get("vulnerabilidades", {}).get("tecnicas", []))

            # Calcular vulnerabilidades corregidas
            vulnerabilidades_corregidas = vulnerabilidades_previas - vulnerabilidades_actuales
            total_vulnerabilidades_previas = len(vulnerabilidades_previas)

            # Evitar división por cero
            if total_vulnerabilidades_previas > 0:
                porcentaje_remediacion = (len(vulnerabilidades_corregidas) / total_vulnerabilidades_previas) * 100
            else:
                porcentaje_remediacion = 0

            # Guardar porcentaje de remediación para cada par de auditorías consecutivas
            porcentajes_remediacion.append({
                "auditoria_previa": auditoria_anterior["numeroAuditoria"],
                "auditoria_actual": auditoria_actual["numeroAuditoria"],
                "porcentaje_remediacion": porcentaje_remediacion
            })

        # Guardar el resultado en la colección de estadísticas
        db["estadisticas"].update_one(
            {"_id": "porcentaje_remediacion_consecutivo"},
            {"$set": {"data": porcentajes_remediacion}},
            upsert=True
        )
        return porcentajes_remediacion
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})

# 4. Calcular vulnerabilidades por activos
def calcular_vulnerabilidades_por_activo():
    # Aggregate vulnerabilities by asset and impact category
    vulnerabilidades_por_activo = db["auditorias"].aggregate([
        {"$unwind": "$vulnerabilidades.tecnicas"},
        {"$match": {
            "$and": [
                {"vulnerabilidades.tecnicas.id": {"$exists": True}},
                {"vulnerabilidades.tecnicas.impact": {"$exists": True}}  # Corrected to "impact"
            ]
        }},
        {"$group": {
            "_id": {
                "activo": "$vulnerabilidades.tecnicas.id",  # Asset ID
                "impacto": "$vulnerabilidades.tecnicas.impact"  # Impact category
            },
            "count": {"$sum": 1}
        }},
        {"$group": {
            "_id": "$_id.activo",
            "categorias": {
                "$push": {
                    "impacto": "$_id.impacto",
                    "count": "$count"
                }
            }
        }}
    ])

    # Create the result in the desired format
    resultado = {}
    for item in vulnerabilidades_por_activo:
        activo = item["_id"]
        resultado[activo] = {cat["impacto"]: cat["count"] for cat in item["categorias"]}
    
    # Check if there are results before trying to insert
    if not resultado:
        print("No se encontraron vulnerabilidades para insertar en la colección.")
    else:
        # Save the result in the statistics collection
        db["estadisticas"].update_one(
            {"_id": "vulnerabilidades_por_activo"},
            {"$set": {"data": resultado}},
            upsert=True
        )
        print("Se insertaron los datos en la colección de estadísticas.")

    return resultado




def calculate_dashboard():
    try:
        calcular_vulnerabilidades_por_activo()
        calcular_vulnerabilidades_por_impacto()
        calcular_porcentaje_remediacion()
        calculate_netscore()
        return jsonify({"status": 200, "message": "Estadisticas del dashboard actualizadas"})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
def get_dashboard():
    try:
        collection = db['estadisticas']
        vulnerabilidades_por_activo = list(collection.find({"_id": "vulnerabilidades_por_activo"}))
        vulnerabilidades_por_impacto = list(collection.find({"_id": "vulnerabilidades_por_impacto"}))
        porcentaje_remediacion = list(collection.find({"_id": "porcentaje_remediacion_consecutivo"}))
        netscore_collection = db['netscore']
        netscores = list(netscore_collection.find({}))
        netscores_serializados = [serialize_document(netscore) for netscore in netscores]
        return jsonify({"status": 200, "vulnerabilidades_por_activo": vulnerabilidades_por_activo, "vulnerabilidades_por_impacto": vulnerabilidades_por_impacto, "porcentaje_remediacion": porcentaje_remediacion, "netscore": netscores_serializados})
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)})
    
    