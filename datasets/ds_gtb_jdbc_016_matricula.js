function createDataset(fields, constraints, sortFields) {
  log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@GRUPO TB");

  let dataset = DatasetBuilder.newDataset();
  let dataSource = "/jdbc/prdJDBC";

  let baseQuery =
    "SELECT * FROM ( SELECT TRIM(SRA.RA_FILIAL) AS RA_FILIAL, TRIM(SRA.RA_MAT) AS RA_MAT, UPPER(TRIM(SRA.RA_NOME)) AS RA_NOME, TRIM(SRA.RA_CC) AS RA_CC, TRIM(SRA.RA_CARGO) AS RA_CARGO, UPPER(TRIM(SRJ.RJ_DESC)) AS RJ_DESC, TRIM(SRA.RA_SALARIO) AS RA_SALARIO, TRIM(SRA.RA_TNOTRAB) AS RA_TNOTRAB, TRIM(SR6.R6_DESC) AS R6_DESC, TRIM(SRA.RA_CATEFD) AS RA_CATEFD, TRIM(REGEXP_REPLACE(RCC.RCC_CONTEU, '^[0-9]+', '', 1, 0)) AS RCC_DESC, TRIM(SRA.RA_CIC) AS RA_CIC, TRIM(SRA.RA_HRSEMAN) AS RA_HRSEMAN FROM SRA010 SRA LEFT JOIN SRJ010 SRJ ON TRIM(SRJ.RJ_FILIAL) = TRIM(SUBSTR(SRA.RA_FILIAL, 1, 3)) AND TRIM(SRJ.RJ_CARGO) = TRIM(SRA.RA_CARGO) LEFT JOIN SR6010 SR6 ON TRIM(SR6.R6_FILIAL) = TRIM(SUBSTR(SRA.RA_FILIAL, 1, 3)) AND TRIM(SR6.R6_TURNO) = TRIM(SRA.RA_TNOTRAB) LEFT JOIN RCC010 RCC ON TRIM(RCC.RCC_FILIAL) = TRIM(SUBSTR(SRA.RA_FILIAL, 1, 3)) AND TRIM(RCC.RCC_CODIGO) = 'S049' AND TRIM(RCC.RCC_CONTEU) LIKE TRIM(SRA.RA_CATEFD) || '%' WHERE SRA.RA_SITFOLH <> 'D' AND SRA.D_E_L_E_T_ <> '*' AND (SRJ.D_E_L_E_T_ <> '*' OR SRJ.D_E_L_E_T_ IS NULL) AND (SR6.D_E_L_E_T_ <> '*' OR SR6.D_E_L_E_T_ IS NULL) AND (RCC.D_E_L_E_T_ <> '*' OR RCC.D_E_L_E_T_ IS NULL) ) WHERE ROWNUM <= 100";

  // Verificação de constraints
  if (constraints != null && constraints.length > 0) {
    for (let i = 0; i < constraints.length; i++) {
      let fieldName = constraints[i].fieldName;
      let initialValue = constraints[i].initialValue;

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
