function createDataset(fields, constraints, sortFields) {
   log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@GRUPO TB");

   let dataset = DatasetBuilder.newDataset();
   let dataSource = "/jdbc/prdJDBC";

   // MUDANÇA AQUI: A query base agora está em uma única linha.
   let queryStart = "SELECT TRIM(A.R7_FILIAL) AS R7_FILIAL, TRIM(A.R7_MAT) AS R7_MAT, TRIM(A.R7_DATA) AS R7_DATA, TRIM(A.R7_TIPO) AS R7_TIPO, TRIM(A.R7_FUNCAO) AS R7_FUNCAO, TRIM(A.R7_DESCFUN) AS R7_DESCFUN, TRIM(A.R7_CARGO) AS R7_CARGO, TRIM(A.R7_DESCCAR) AS R7_DESCCAR FROM SR7010 A WHERE A.D_E_L_E_T_ <> '*' AND A.R7_TIPO IN ('004', '005', 'REN')";

   let queryEnd = " ORDER BY A.R7_DATA DESC";

   if (constraints != null && constraints.length > 0) {
      for (let i = 0; i < constraints.length; i++) {
         let fieldName = constraints[i].fieldName;
         let initialValue = constraints[i].initialValue;

         if (fieldName && fieldName != "sqlLimit") {
            queryStart += " AND " + fieldName + " = '" + initialValue + "'";
            log.info("Filtro aplicado na query para " + fieldName + ": " + initialValue);
         }
      }
   } else {
      log.info("Nenhuma constraint aplicada.");
   }

   let finalQuery = "SELECT T.* FROM (" + queryStart + queryEnd + ") T WHERE ROWNUM = 1";

   log.info("QUERY FINAL: " + finalQuery);

   var ic = new javax.naming.InitialContext();
   var ds = ic.lookup(dataSource);
   var conn = null;
   var stmt = null;
   var rs = null;

   try {
      conn = ds.getConnection();
      stmt = conn.createStatement();
      rs = stmt.executeQuery(finalQuery);

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
            row.push(value != null ? value.toString() : "");
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
