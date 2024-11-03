from pymongo import MongoClient
import logging
from flask import jsonify
import google.generativeai as genai
import os
from datetime import datetime
import json


genai.configure(api_key=os.environ["API_KEY"])


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

        return jsonify({"status": 200, "netscore": netscore})
    
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