function createDataset(fields, constraints, sortFields) {
   log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@GRUPO TB");
   let dataset = DatasetBuilder.newDataset();
   let dataSource = "/jdbc/prdJDBC";
   let query = "SELECT TRIM(A.RA_FILIAL) AS RA_FILIAL, TRIM(A.RA_MAT) AS RA_MAT, TRIM(A.RA_NOME) AS RA_NOME, TRIM(A.RA_SITFOLH) AS RA_SITFOLH FROM SRA010 A WHERE A.D_E_L_E_T_ <> '*' AND A.RA_SITFOLH <> 'D'";
   let whereClause = "";
   if (constraints != null && constraints.length > 0) {
      for (let i = 0; i < constraints.length; i++) {
         let fieldName = constraints[i].fieldName;
         let initialValue = constraints[i].initialValue;
         if (fieldName && fieldName != "sqlLimit") {
            if (fieldName === "RA_MAT") {
               whereClause += " AND TRIM(A.RA_MAT) = '" + initialValue + "'";
               log.info("Filtro de IGUALDADE aplicado na query para A.RA_MAT: '" + initialValue + "'");
            } else {
               whereClause += " AND UPPER(A." + fieldName + ") LIKE '%" + initialValue.toUpperCase() + "%'";
               log.info("Filtro LIKE aplicado na query para " + fieldName + ": '%" + initialValue.toUpperCase() + "%'");
            }
         }
      }
   }
   let orderBy = " ORDER BY A.RA_MAT";
   let finalQuery = "SELECT * FROM (" + query + whereClause + orderBy + ") WHERE ROWNUM <= 100";
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
function onSync(lastSyncDate) {
   return createDataset(null, null, null);
}
function onMobileSync(user) {}
