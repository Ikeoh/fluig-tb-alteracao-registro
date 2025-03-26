function createDataset(fields, constraints, sortFields) {
   log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@GRUPO TB");

   let dataset = DatasetBuilder.newDataset();
   let dataSource = "/jdbc/prdJDBC";

   // Consulta base - Note a adição do alias A para a coluna RA_CC
   let baseQuery = "SELECT TRIM(A.RA_CC) AS CENTRO_CUSTO, COUNT(CASE WHEN A.RA_SITFOLH <> 'D' THEN 1 END) AS VAGAS_ATIVAS FROM SRA010 A WHERE TRIM(A.RA_CC) IS NOT NULL AND TRIM(A.RA_CC) <> 'null'";

   // Verificação de constraints e construção da cláusula WHERE dinamicamente
   if (constraints != null && constraints.length > 0) {
      let whereClause = "";
      for (let i = 0; i < constraints.length; i++) {
         let fieldName = constraints[i].fieldName;
         let initialValue = constraints[i].initialValue;
         //let finalValue = constraints[i].finalValue; // Não usado, pois você está usando LIKE
         //let constraintType = constraints[i].constraintType; // Não usado diretamente, assumindo LIKE

         // Ignorar constraints não desejadas, como sqlLimit
         if (fieldName && fieldName != "sqlLimit") {
            // Adiciona "AND" para cada constraint, exceto a primeira
            if (whereClause.length > 0) {
               whereClause += " AND ";
            }
            // Usa TRIM e LIKE para a busca, e trata o caso de RA_CC
            if (fieldName == "CENTRO_CUSTO") {
               whereClause += "TRIM(A.RA_CC) LIKE '%" + initialValue + "%'";
            } else {
               whereClause += "TRIM(" + fieldName + ") LIKE '%" + initialValue + "%'";
            }
         }
      }
      // Adiciona a cláusula WHERE à consulta base, SE houver constraints
      if (whereClause.length > 0) {
         baseQuery += " AND " + whereClause;
      }
   }

   // Adiciona o GROUP BY e ORDER BY ao final
   baseQuery += " GROUP BY TRIM(A.RA_CC) ORDER BY TRIM(A.RA_CC)";

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
