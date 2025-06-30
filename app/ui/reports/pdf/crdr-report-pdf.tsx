"use client";

import { DeliveryFilters } from "@/app/lib/definitions";
import { formatDateToLocal } from "@/app/lib/utils";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  header: { fontSize: 14, marginBottom: 10, textAlign: "center" },
  section: { marginBottom: 10 },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
  },
  cell: { flex: 1, paddingHorizontal: 2 },
  tableHeader: { fontWeight: "bold", backgroundColor: "#eee" },
});

// Safe parse helper
const parseJSON = (input: unknown): any[] => {
  try {
    return typeof input === "string"
      ? JSON.parse(input)
      : Array.isArray(input)
      ? input
      : [];
  } catch {
    return [];
  }
};

// Props
type Props = {
  data: any[];
  filters: DeliveryFilters;
};

export const CrDrReportPDF = ({ data = [], filters }: Props) => {
  const totalCredit = data.reduce(
    (sum, row) => sum + (Number(row?.credit_amount) || 0),
    0
  );

  const totalCost = data.reduce((sum, row) => {
    const costs = parseJSON(row?.delivery_costs_data);
    return (
      sum + costs.reduce((acc, item) => acc + (Number(item?.cost) || 0), 0)
    );
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Cr/Dr Report Summary</Text>

        <View style={styles.section}>
          <Text>
            Start Date: {formatDateToLocal(filters?.startDate) || "-"}
          </Text>
          <Text>End Date: {formatDateToLocal(filters?.endDate) || "-"}</Text>
          {!!filters?.vehicle && (
            <Text>Vehicle No: {String(filters.vehicle)}</Text>
          )}
          {!!filters?.query && <Text>Voucher No: {String(filters.query)}</Text>}
          <Text>Total Credit: ৳ {totalCredit}</Text>
          <Text>Total Cost: ৳ {totalCost}</Text>
        </View>

        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.cell}>#</Text>
          <Text style={styles.cell}>Vehicle</Text>
          <Text style={styles.cell}>Credit</Text>
          <Text style={styles.cell}>Cost</Text>
        </View>

        {data.map((row, i) => {
          const costs = parseJSON(row?.delivery_costs_data);
          const costTotal = costs.reduce(
            (acc, item) => acc + (Number(item?.cost) || 0),
            0
          );

          return (
            <View key={row?.id ?? i} style={styles.row}>
              <Text style={styles.cell}>
                {typeof row?.id === "number" || typeof row?.id === "string"
                  ? row.id
                  : i + 1}
              </Text>
              <Text style={styles.cell}>{String(row?.vehicle || "-")}</Text>
              <Text style={styles.cell}>{Number(row?.credit_amount) || 0}</Text>
              <Text style={styles.cell}>{costTotal}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
