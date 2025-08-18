function createDataset(fields, constraints, sortFields) {
   log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@GRUPO TB");

   let dataset = DatasetBuilder.newDataset();
   let dataSource = "/jdbc/prdJDBC";

   let baseQuery = "SELECT * FROM ( SELECT * FROM SYS_COMPANY A WHERE A.D_E_L_E_T_ <> '*' AND A.M0_CODFIL IN ('002001', '016001', '024001', '032001', '034001')) WHERE ROWNUM <= 100";

   // Verificação de constraints
   if (constraints != null && constraints.length > 0) {
      for (let i = 0; i < constraints.length; i++) {
         let fieldName = constraints[i].fieldName;
         let initialValue = constraints[i].initialValue;
         let constraintType = constraints[i].constraintType;

         // Ignorar constraints não desejadas, como sqlLimit
         if (fieldName && fieldName != "sqlLimit") {
            baseQuery += " AND TRIM(" + fieldName + ") LIKE '%" + initialValue + "%'";
            log.info("Filtro aplicado na query para " + fieldName + ": " + initialValue);
         }
      }
   } else {
      log.info("Nenhuma constraint aplicada.");
   }

   log.info("QUERY FINAL: " + baseQuery);

   var ic = new javax.naming.InitialContext();
   var ds = ic.lookup(dataSource);
   var conn = null;
   var stmt = null;
   var rs = null;

   try {
      conn = ds.getConnection();
      stmt = conn.createStatement();
      rs = stmt.executeQuery(baseQuery);

      var columnCount = rs.getMetaData().getColumnCount();
      var created = false;

      while (rs.next()) {
         if (!created) {
            for (var i = 1; i <= columnCount; i++) {
               dataset.addColumn(rs.getMetaData().getColumnName(i));
            }
            created = true;
         }

         var row = [];
         for (var i = 1; i <= columnCount; i++) {
            var value = rs.getObject(i);
            row.push(value != null ? value.toString().trim() : "null");
         }
         dataset.addRow(row);
      }
   } catch (e) {
      log.error("ERRO==============> " + e.message);
   } finally {
      if (rs != null) {
         rs.close();
      }
      if (stmt != null) {
         stmt.close();
      }
      if (conn != null) {
         conn.close();
      }
   }

   log.info("::::::::::::::::::::::::::FIM | CRIANDO DATASET - @@GRUPO TB");
   return dataset;
}

// Função de sincronização automática
function onSync(lastSyncDate) {
   return createDataset(null, null, null);
}

function onMobileSync(user) {
   // Função para sincronização móvel, pode ser personalizada conforme necessário
}
