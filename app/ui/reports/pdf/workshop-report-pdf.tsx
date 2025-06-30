"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { formatDateToLocal } from "@/app/lib/utils";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "1px solid #ccc",
  },
  field: {
    marginBottom: 2,
  },
  note: {
    marginTop: 4,
    fontStyle: "italic",
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
  credit: {
    textAlign: "right",
  },
});

type WorkshopFilters = {
  startDate: string;
  endDate: string;
  vehicle: string;
  mechanic?: string;
  query: string;
};

type Props = {
  filters: WorkshopFilters;
  data: any[];
};

export default function WorkshopReportPDF({ filters, data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Summary */}
        <Text style={styles.title}>Workshop Report</Text>
        <View style={styles.section}>
          <Text>
            <Text style={styles.bold}>Start Date:</Text>{" "}
            {filters.startDate || "-"}
          </Text>
          <Text>
            <Text style={styles.bold}>End Date:</Text> {filters.endDate || "-"}
          </Text>
          {filters.vehicle && (
            <Text>
              <Text style={styles.bold}>Vehicle No:</Text> {filters.vehicle}
            </Text>
          )}
          {filters.mechanic && (
            <Text>
              <Text style={styles.bold}>Mechanic:</Text> {filters.mechanic}
            </Text>
          )}
          {filters.query && (
            <Text>
              <Text style={styles.bold}>Memo / Job No:</Text> {filters.query}
            </Text>
          )}
        </View>

        {/* Data */}
        {data.length === 0 ? (
          <Text>No data found.</Text>
        ) : (
          data.map((row, idx) => (
            <View key={row.id || idx} style={styles.row}>
              <Text style={styles.field}>
                <Text style={styles.bold}>#{row.id || "-"}</Text> ·{" "}
                {formatDateToLocal(row.date)}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.bold}>Memo ID:</Text> {row.memoId}
              </Text>
              <Text style={styles.field}>
                <Text style={styles.bold}>Vehicle:</Text> {row.vehicle}
              </Text>
              {row.mechanic && (
                <Text style={styles.field}>
                  <Text style={styles.bold}>Mechanic:</Text> {row.mechanic}
                </Text>
              )}
              <Text style={styles.field}>
                <Text style={styles.bold}>Parts:</Text>{" "}
                {Array.isArray(row.parts)
                  ? row.parts
                      .map(
                        (part: any) =>
                          `${part.part} × ${part.quantity} @ ${part.price}`
                      )
                      .join("; ")
                  : "-"}
              </Text>
              <Text style={[styles.field, styles.credit]}>
                <Text style={styles.bold}>Total:</Text> ₹ {row.total ?? 0}
              </Text>
              {row.note && <Text style={styles.note}>Note: {row.note}</Text>}
            </View>
          ))
        )}
      </Page>
    </Document>
  );
}
