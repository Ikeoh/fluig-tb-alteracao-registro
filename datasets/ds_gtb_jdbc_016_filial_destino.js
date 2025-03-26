function createDataset(fields, constraints, sortFields) {
  log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@GRUPO TB");

  let dataset = DatasetBuilder.newDataset();
  let dataSource = "/jdbc/prdJDBC";

  let baseQuery =
    "SELECT * FROM ( SELECT TRIM(M0_CODFIL) AS M0_CODFIL, SUBSTR(TRIM(M0_CODFIL),1,3) AS M0_CODFIL_3DIG, TRIM(M0_FILIAL) AS M0_FILIAL, TRIM(M0_NOMECOM) AS M0_NOMECOM, TRIM(M0_CGC) AS M0_CGC, TRIM(M0_INSC) AS M0_INSC, TRIM(M0_INSCM) AS M0_INSCM, TRIM(M0_ENDENT) AS M0_ENDENT, TRIM(M0_COMPENT) AS M0_COMPENT, TRIM(M0_BAIRENT) AS M0_BAIRENT, TRIM(M0_CIDENT) AS M0_CIDENT, TRIM(M0_ESTENT) AS M0_ESTENT, TRIM(M0_CODMUN) AS M0_CODMUN FROM SYS_COMPANY WHERE D_E_L_E_T_ <> '*' ) WHERE ROWNUM <= 100";

  // Verificação de constraints
  if (constraints != null && constraints.length > 0) {
    for (let i = 0; i < constraints.length; i++) {
      let fieldName = constraints[i].fieldName;
      let initialValue = constraints[i].initialValue;
      let finalValue = constraints[i].finalValue;
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
