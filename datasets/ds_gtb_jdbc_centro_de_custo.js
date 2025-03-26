function createDataset(fields, constraints, sortFields) {
  log.info("::::::::::::::::::::::::::INICIO | CRIANDO DATASET - @@GRUPO TB");

  let dataset = DatasetBuilder.newDataset();
  let dataSource = "/jdbc/prdJDBC";

  let baseQuery =
    "SELECT TRIM(A.CTT_CUSTO) AS CTT_CUSTO, TRIM(A.CTT_DESC01) AS CTT_DESC01, TRIM(A.CTT_XRES) AS CTT_XRES, TRIM(B.USR_CODIGO) AS XRES_LOGIN, TRIM(A.CTT_XDIRET) AS CTT_XDIRET, TRIM(C.USR_CODIGO) AS XDIRET_LOGIN, TRIM(A.CTT_XSIT) AS CTT_XSIT, TRIM(A.CTT_CLASSE) AS CTT_CLASSE, TRIM(A.CTT_BLOQ) AS CTT_BLOQ, TRIM(A.CTT_XSTAT) AS CTT_XSTAT, TRIM(A.CTT_ENDER) AS CTT_ENDER  FROM CTT010 A LEFT JOIN SYS_USR B ON TRIM(UPPER(A.CTT_XEMAIL)) = TRIM(UPPER(B.USR_EMAIL)) AND B.D_E_L_E_T_ <> '*' AND B.USR_MSBLQL = '2' LEFT JOIN SYS_USR C ON TRIM(UPPER(A.CTT_XEMAID)) = TRIM(UPPER(C.USR_EMAIL)) AND C.D_E_L_E_T_ <> '*' AND C.USR_MSBLQL = '2' WHERE A.CTT_CLASSE = '2' AND A.CTT_BLOQ = '2' AND A.CTT_XSTAT != '4' AND A.CTT_XSTAT != ' ' AND A.D_E_L_E_T_ <> '*'";

  // Verificação de constraints (rest remains the same)
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
