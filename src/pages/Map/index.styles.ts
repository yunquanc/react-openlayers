import { createStyles, css } from "antd-style";

export default createStyles({
  content: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fff",
  },
  treeMenu: {
    width: "200px",
    height: "100%",
    borderRight: "1px solid #f5f5f5",
    padding: "10px",
    flex: "0 0 200px",
  },
  treeTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.85)",
    padding: "0 14px",
    height: "60px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tableContent: {
    flex: "1 1 100%",
    height: "100%",
    padding: "10px",
    width: "auto",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  table: {},
  tableHeader: {
    height: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTit: {
    fontSize: "16px",
  },
  headerRight: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px",
  },
});
