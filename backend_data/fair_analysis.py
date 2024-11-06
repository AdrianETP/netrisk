import sys
import json

from flask import jsonify

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
fair_analysis.py
Description: This script performs FAIR risk analysis.
Author: Ramón Gómez 
Date: 2024-10-20
"""

#TEF CALCULATION
def calculate_contact_frequency(contact_frequency_n):
    contact_frequency_q = 0

    if contact_frequency_n <= 0.1: 
        contact_frequency_q = 0
    elif contact_frequency_n > 0.1 and contact_frequency_n <= 1:
        contact_frequency_q = 1
    elif contact_frequency_n > 1 and contact_frequency_n <= 10:
        contact_frequency_q = 2
    elif contact_frequency_n > 10 and contact_frequency_n <= 100:
        contact_frequency_q = 3
    elif contact_frequency_n > 100: 
        contact_frequency_q = 4
    else:
        return 
    
    return contact_frequency_q

def  calculate_probability_of_acting_(probability_of_acting_n):
    probability_of_acting_q = 0
    
    if probability_of_acting_n <= 0.01: 
        probability_of_acting_q = 0
    elif probability_of_acting_n > 0.01 and probability_of_acting_n <= 0.30:
        probability_of_acting_q = 1
    elif probability_of_acting_n > 0.30 and probability_of_acting_n <= 0.70:
        probability_of_acting_q = 2
    elif probability_of_acting_n > 0.70 and probability_of_acting_n <= 0.99:
        probability_of_acting_q = 3
    elif probability_of_acting_n > 0.99: 
        probability_of_acting_q= 4
    else:
        return 
    
    return probability_of_acting_q

#TEF CALCULATION = PROBABILITY OF ACTING * CONTACT FREQUENCY
TEF_matrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 1, 2, 2, 2],
    [1, 2, 3, 3, 3],
    [2, 3, 4, 4, 4]
]

#VULNERABILITY CALCULATION = THREAT CAPACITY * RESISTANCE STRENGTH
vulnerability_matrix = [
    [2, 1, 0, 0, 0],
    [3, 2, 1, 0, 0],
    [4, 3, 2, 1, 0],
    [4, 4, 3, 2, 1],
    [4, 4, 4, 3, 2]
]

#LEF CALCULATION = TEF * VULNERABILITY
LEF_matrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 1, 2, 2, 2],
    [1, 2, 3, 3, 3],
    [2, 3, 4, 4, 4]
]

#LOSS MAGNITUDE CALCULATION = SECONDARY LOSS MAGNITUDE * PRIMARY LOSS MAGNITUDE
def calculate_primary_loss_magnitude(primary_loss_magnitude_n):
    primary_loss_magnitude_q = 0
    
    if primary_loss_magnitude_n < 10000: 
        primary_loss_magnitude_q = 0
    elif primary_loss_magnitude_n >= 10000 and primary_loss_magnitude_n <= 99999:
        primary_loss_magnitude_q = 1
    elif primary_loss_magnitude_n > 99999 and primary_loss_magnitude_n <= 999999:
        primary_loss_magnitude_q = 2
    elif primary_loss_magnitude_n > 999999 and primary_loss_magnitude_n <= 9999999:
        primary_loss_magnitude_q = 3
    elif primary_loss_magnitude_n > 9999999: 
        primary_loss_magnitude_q = 4
    else:
        return 
    
    return primary_loss_magnitude_q 

def secondary_loss_magnitude(secondary_loss_magnitude_n):
    secondary_loss_magnitude_q = 0
    
    if secondary_loss_magnitude_n < 10000: 
        secondary_loss_magnitude_q = 0
    elif secondary_loss_magnitude_n >= 10000 and secondary_loss_magnitude_n <= 99999:
        secondary_loss_magnitude_q = 1
    elif secondary_loss_magnitude_n > 99999 and secondary_loss_magnitude_n <= 999999:
        secondary_loss_magnitude_q = 2
    elif secondary_loss_magnitude_n > 999999 and secondary_loss_magnitude_n <= 9999999:
        secondary_loss_magnitude_q = 3
    elif secondary_loss_magnitude_n > 9999999: 
        secondary_loss_magnitude_q = 4
    else:
        return 
    
    return secondary_loss_magnitude_q

#SECONDARY LOSS CALCUATION =  SECONDARY LOSS MAGNITUDE * SECONDARY LOSS EVENT FREQUENCY
secondary_loss_matrix = [
    [0, 0, 1, 1, 1],
    [0, 1, 1, 1, 2],
    [1, 1, 1, 2, 2],
    [1, 1, 2, 2, 3],
    [1, 2, 2, 3, 4]
]

#LOSS MAGNITUDE CALCULATION = PRIMARY LOSS MAGNITUDE * SECONDARY LOSS MAGNITUDE 
loss_magnitude_matrix = [
    [0, 0, 0, 1, 2],
    [0, 0, 1, 2, 3],
    [0, 1, 2, 3, 4],
    [1, 2, 3, 4, 4],
    [2, 3, 4, 4, 4]
]

def calculate_loss_magnitude_n(loss_magnitude_q):    
    if loss_magnitude_q == 0: 
        loss_magnitude_n = (0,9999)
    elif loss_magnitude_q == 1:
        loss_magnitude_n = (10000, 99999)
    elif loss_magnitude_q == 2:
        loss_magnitude_n = (100000, 999999)
    elif loss_magnitude_q == 3:
        loss_magnitude_n = (1000000, 9999999)
    elif loss_magnitude_q == 4: 
        loss_magnitude_n = (10000000, 99999999)
    else:
        return 
    
    return loss_magnitude_n

#RISK CALCULATION = LEF * LOSS MAGNITUDE
risk_matrix = [
    [0, 0, 0, 1, 2],
    [0, 0, 1, 2, 3],
    [0, 1, 2, 3, 4],
    [1, 2, 3, 4, 4],
    [2, 3, 4, 4, 4]
]

def FAIR(contact_frequency_n, probability_of_acting_n, threat_capacity_q, resistance_strength_q, primary_loss_magnitude_n, secondary_loss_magnitude_n, secondary_loss_event_frequency_q):
    #Tier escale 
    to_tier = {
        0: "VL",
        1: "L",
        2: "M",
        3: "H",
        4: "VH"
    }

    # Analysis variables 
    # contact_frequency_n: Float ((0,1), +100) - Threat Event Frequency in times per year
    # probability_of_acting_n: Float(0,1) Probability of Acting  in %

    # threat_capacity_q: Int (0, 4) - Threat Capacity (threat_capacity_) in Tier (VL, L, M, H, VH) based on percentage
    # resistance_strength_q: Int (0, 4) - Resistance Strength (resistance_strength_) in Tier (VL, L, M, H, VH) based on percentage

    # primary_loss_magnitude_n: Int - Primary Loss Magnitude (primary_loss_magnitude_) in USD
    # secondary_loss_magnitude_n: Int - Secondary Loss Magnitude (secondary_loss_magnitude_) in USD
    # secondary_loss_event_frequency_q: Int (0, 4) - Secondary Loss Event Frequency (secondary_loss_event_frequency_) in Tier (VL, L, M, H, VH) based on percentage
    
    #S2: EVALUATE THE LOS EVENT FREQUENCY 
    #S2.1: Estimate the Threat Event Frequency (TEF) per year
    contact_frequency_q = calculate_contact_frequency(contact_frequency_n)
    probability_of_acting_q = calculate_probability_of_acting_(probability_of_acting_n)
    TEF = TEF_matrix[probability_of_acting_q][contact_frequency_q]
    
    #S2.1.2: Estimate the Vulnerability (VUL) of the asset
    vulnerability = vulnerability_matrix[threat_capacity_q][resistance_strength_q] 
    # print("Vulnerability: ", vulnerability)
    
    #S2.1.3: Estimate the Loss Event Frequency (LEF) per year
    LEF = LEF_matrix[TEF][vulnerability]
    
    #S3: ESTIMATE THE LOSS MAGNITUDE
    #S3.1: Estimate the Primary Loss Magnitude (
    primary_loss_magnitude_q = calculate_primary_loss_magnitude(primary_loss_magnitude_n)

    #S3.2: Estimate the Secondary Loss Magnitude (SLM)
    secondary_loss_magnitude_q = secondary_loss_magnitude(secondary_loss_magnitude_n)
    
    #S3.3: Estimate the Secondary Loss Event Frequency (SLEF)
    secondary_loss = secondary_loss_matrix[secondary_loss_magnitude_q][secondary_loss_event_frequency_q]
    
    #S3.4: Estimate the Loss Magnitude (LM)
    loss_magnitude_q = loss_magnitude_matrix[primary_loss_magnitude_q][secondary_loss]
    loss_magnitude_n = calculate_loss_magnitude_n(loss_magnitude_q)
    
    #S4: ESTIMATE THE RISK
    risk = risk_matrix[loss_magnitude_q][LEF]
    
    result = {
        "Loss Magnitude Tier": to_tier[loss_magnitude_q],
        "Loss Magnitude Range": f"${loss_magnitude_n[0]:,} - ${loss_magnitude_n[1]:,}",
        "Average Loss Magnitude": primary_loss_magnitude_n + secondary_loss_magnitude_n,
        "Risk Tier": to_tier[risk]
    }
    
    return jsonify({"status": 200, "data": result})

def main():
    print("Caso: Robo de credenciales por parte de un empleado")
    contact_frequency_n = 100 
    probability_of_acting_n = 0.2 
    threat_capacity_q = 2 
    resistance_strength_q = 0 
    primary_loss_magnitude_n = 100050 
    secondary_loss_magnitude_n = 100027 
    secondary_loss_event_frequency_q = 4 
    FAIR(contact_frequency_n, probability_of_acting_n, threat_capacity_q, resistance_strength_q, primary_loss_magnitude_n, secondary_loss_magnitude_n, secondary_loss_event_frequency_q)

    print("\nCaso: Ataque de ransomware por puerto Telnet abierto")
    contact_frequency_n = 100 
    probability_of_acting_n = 0.80 
    threat_capacity_q = 2 
    resistance_strength_q = 2 
    primary_loss_magnitude_n = 2500000 
    secondary_loss_magnitude_n = 6500000 
    secondary_loss_event_frequency_q = 4 
    FAIR(contact_frequency_n, probability_of_acting_n, threat_capacity_q, resistance_strength_q, primary_loss_magnitude_n, secondary_loss_magnitude_n, secondary_loss_event_frequency_q)

    print("\nCaso: Ataque de phishing por falta de capacitación")
    contact_frequency_n = 1000 
    probability_of_acting_n = 0.80 
    threat_capacity_q = 2 
    resistance_strength_q = 1 
    primary_loss_magnitude_n = 150000 
    secondary_loss_magnitude_n = 1000000
    secondary_loss_event_frequency_q = 3 
    FAIR(contact_frequency_n, probability_of_acting_n, threat_capacity_q, resistance_strength_q, primary_loss_magnitude_n, secondary_loss_magnitude_n, secondary_loss_event_frequency_q)

    print("\nCaso: Ataque de DDoS por puerto 23 abierto")
    contact_frequency_n = 150
    probability_of_acting_n = 0.80 
    threat_capacity_q = 2 
    resistance_strength_q = 3
    primary_loss_magnitude_n = 250000 
    secondary_loss_magnitude_n = 250000
    secondary_loss_event_frequency_q = 4 
    FAIR(contact_frequency_n, probability_of_acting_n, threat_capacity_q, resistance_strength_q, primary_loss_magnitude_n, secondary_loss_magnitude_n, secondary_loss_event_frequency_q)


if __name__ == "__main__":
    main()