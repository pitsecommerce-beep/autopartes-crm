#!/usr/bin/env python3
"""
Script de Importación de Productos
Importa productos desde Excel a Supabase
Uso: python import_products.py
"""

import pandas as pd
import os
from supabase import create_client, Client

# ============================================
# CONFIGURACIÓN
# ============================================

# Obtener credenciales de variables de entorno o pedir al usuario
SUPABASE_URL = os.getenv('SUPABASE_URL') or input('Ingresa tu SUPABASE_URL: ')
SUPABASE_KEY = os.getenv('SUPABASE_KEY') or input('Ingresa tu SUPABASE_ANON_KEY: ')
EXCEL_FILE = 'ejemplo_informacion_autopartes.xlsx'

# ============================================
# FUNCIONES
# ============================================

def connect_to_supabase():
    """Conectar a Supabase"""
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Conectado a Supabase exitosamente")
        return supabase
    except Exception as e:
        print(f"❌ Error conectando a Supabase: {e}")
        exit(1)

def read_excel_file():
    """Leer archivo Excel"""
    try:
        df = pd.read_excel(EXCEL_FILE)
        print(f"✅ Archivo Excel leído: {len(df)} productos encontrados")
        return df
    except FileNotFoundError:
        print(f"❌ Archivo no encontrado: {EXCEL_FILE}")
        exit(1)
    except Exception as e:
        print(f"❌ Error leyendo Excel: {e}")
        exit(1)

def clean_data(df):
    """Limpiar y preparar datos para Supabase"""
    # Renombrar columnas para que coincidan con la BD
    column_mapping = {
        'SKU': 'sku',
        'DESCRIPCION': 'descripcion',
        'EXISTENCIA_CDMX': 'existencia_cdmx',
        'EXISTENCIA_TULTI': 'existencia_tulti',
        'EXISTENCIA_FORÁNEA': 'existencia_foranea',
        'URL_IMAGEN': 'url_imagen',
        'PRECIO_COMPRA': 'precio_compra',
        'PRECIO_VENTA': 'precio_venta',
        'PARTE': 'parte',
        'MODELO': 'modelo',
        'MARCA': 'marca',
        'MODELOS_COMPATIBLES': 'modelos_compatibles',
        'LADO': 'lado',
        'DEL_TRAS': 'del_tras',
        'INT_EXT': 'int_ext'
    }
    
    df = df.rename(columns=column_mapping)
    
    # Reemplazar NaN con None (NULL en SQL)
    df = df.where(pd.notnull(df), None)
    
    # Convertir a diccionario de registros
    records = df.to_dict('records')
    
    print(f"✅ Datos limpiados: {len(records)} registros listos")
    return records

def import_to_supabase(supabase, records, batch_size=100):
    """Importar productos a Supabase en lotes"""
    total = len(records)
    imported = 0
    errors = 0
    
    print(f"\n📦 Iniciando importación de {total} productos...")
    
    # Dividir en lotes
    for i in range(0, total, batch_size):
        batch = records[i:i + batch_size]
        
        try:
            # Usar upsert para actualizar existentes o insertar nuevos
            response = supabase.table('productos').upsert(batch).execute()
            imported += len(batch)
            
            print(f"✅ Lote {i//batch_size + 1}: {len(batch)} productos importados ({imported}/{total})")
            
        except Exception as e:
            errors += len(batch)
            print(f"❌ Error en lote {i//batch_size + 1}: {e}")
    
    print(f"\n{'='*50}")
    print(f"✅ Importación completada")
    print(f"   • Total productos: {total}")
    print(f"   • Importados exitosamente: {imported}")
    print(f"   • Errores: {errors}")
    print(f"{'='*50}\n")
    
    return imported, errors

# ============================================
# SCRIPT PRINCIPAL
# ============================================

def main():
    print("\n" + "="*50)
    print("🚀 IMPORTADOR DE PRODUCTOS - AUTOPARTES CRM/ERP")
    print("="*50 + "\n")
    
    # 1. Conectar a Supabase
    supabase = connect_to_supabase()
    
    # 2. Leer Excel
    df = read_excel_file()
    
    # 3. Limpiar datos
    records = clean_data(df)
    
    # 4. Confirmar importación
    print(f"\n⚠️  ¿Deseas importar {len(records)} productos?")
    confirm = input("Escribe 'si' para continuar: ")
    
    if confirm.lower() != 'si':
        print("❌ Importación cancelada")
        exit(0)
    
    # 5. Importar a Supabase
    imported, errors = import_to_supabase(supabase, records)
    
    # 6. Verificar importación
    print("\n🔍 Verificando datos en Supabase...")
    try:
        response = supabase.table('productos').select("count", count='exact').execute()
        total_in_db = response.count
        print(f"✅ Total de productos en base de datos: {total_in_db}")
    except Exception as e:
        print(f"❌ Error verificando: {e}")
    
    print("\n✨ ¡Proceso completado!")

if __name__ == "__main__":
    main()
