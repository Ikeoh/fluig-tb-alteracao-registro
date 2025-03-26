function createDataset(fields, constraints, sortFields) {
   log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@VAGAS_ATIVAS");

   let dataset = DatasetBuilder.newDataset();
   let dataSource = "/jdbc/prdJDBC";

   // Consulta SQL em uma única linha, com aliases para os campos
   let baseQuery = "WITH VagasAtivas AS (SELECT TRIM(SRA.RA_CC) AS CENTRO_CUSTO, COUNT(CASE WHEN SRA.RA_SITFOLH <> 'D' THEN 1 END) AS VAGAS_ATIVAS FROM SRA010 SRA WHERE TRIM(SRA.RA_CC) IS NOT NULL AND TRIM(SRA.RA_CC) <> 'null' GROUP BY TRIM(SRA.RA_CC)) SELECT CTT.CTT_CUSTO, CTT.CTT_CLASSE, CTT.CTT_XQTDPE, CTT.CTT_XQTDRE, COALESCE(VA.VAGAS_ATIVAS, 0) AS VAGAS_ATIVAS FROM CTT010 CTT LEFT JOIN VagasAtivas VA ON TRIM(CTT.CTT_CUSTO) = VA.CENTRO_CUSTO WHERE CTT.CTT_CLASSE = '2' AND CTT.D_E_L_E_T_ <> '*'";

   // Aplicação das constraints
   if (constraints != null && constraints.length > 0) {
      let whereAdded = false;

      for (let i = 0; i < constraints.length; i++) {
         let fieldName = constraints[i].fieldName;
         let initialValue = constraints[i].initialValue;
         let finalValue = constraints[i].finalValue; // Não usado
         let constraintType = constraints[i].constraintType; // Não usado

         if (fieldName && fieldName != "sqlLimit") {
            let sqlOperator = " LIKE ";
            let searchValue = "'%" + initialValue + "%'";

            if (!whereAdded) {
               baseQuery += " AND (";
               whereAdded = true;
            } else {
               baseQuery += " OR ";
            }
            // Não usar TRIM na constraint, referenciar a coluna diretamente
            baseQuery += fieldName + sqlOperator + searchValue;
         }
      }
      if (whereAdded) {
         baseQuery += ")";
      }
   }

   baseQuery += " ORDER BY CTT.CTT_CUSTO"; // Ordenar pela coluna, não pelo TRIM

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
            // Usar getString() e trim() aqui, depois de obter o valor
            row.push(value != null ? rs.getString(i).trim() : "");
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

   log.info("::::::::::::::::::::::::::FIM | CRIANDO DATASET - @@VAGAS_ATIVAS");
   return dataset;
}

function onSync(lastSyncDate) {
   return createDataset(null, null, null);
}

function onMobileSync(user) {
   // Função para sincronização móvel
}
