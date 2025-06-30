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
import { DeliveryFilters } from "@/app/lib/definitions";

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
  routeBlock: {
    display: "flex",
    flexDirection: "column",
    marginTop: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  credit: {
    textAlign: "right",
  },
});

type Props = {
  filters: DeliveryFilters;
  data: any[];
};

export default function DeliveryReportPDF({ filters, data }: Props) {
    
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Summary */}
        <Text style={styles.title}>Delivery Report</Text>
        <View style={styles.section}>
          <Text>
            <Text style={styles.bold}>Start Date:</Text> {filters.startDate || "-"}
          </Text>
          <Text>
            <Text style={styles.bold}>End Date:</Text> {filters.endDate || "-"}
          </Text>
          {filters.vehicle && (
            <Text>
              <Text style={styles.bold}>Vehicle No:</Text> {filters.vehicle}
            </Text>
          )}
          {filters.query && (
            <Text>
              <Text style={styles.bold}>Booking / Challan / Voucher No:</Text> {filters.query}
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
                <Text style={styles.bold}>#{row.id || "-"}</Text> · {formatDateToLocal(row.created_at)}
              </Text>

              <Text style={styles.field}>
                <Text style={styles.bold}>Customer:</Text> {row.customer}
              </Text>

              <Text style={styles.field}>
                <Text style={styles.bold}>Vehicle:</Text> {row.vehicle}
              </Text>

              <Text style={styles.field}>
                <Text style={styles.bold}>Driver:</Text> {row.driver}
              </Text>

              <View style={styles.routeBlock}>
                {/* First leg */}
                <Text style={styles.field}>
                  <Text style={styles.bold}>Pickup:</Text> {row.pickup_address} at {formatDateToLocal(row.pickup_dt)}
                </Text>
                <Text style={styles.field}>
                  <Text style={styles.bold}>Dropoff:</Text> {row.dropoff_address} at {formatDateToLocal(row.dropoff_dt)}
                </Text>

                {/* Return leg */}
                {row.booking_type === "return" &&
                  row.return_pickup_dt &&
                  row.return_dropoff_dt && (
                    <>
                      <Text style={styles.field}>
                        <Text style={styles.bold}>Return Pickup:</Text> {row.dropoff_address} at {formatDateToLocal(row.return_pickup_dt)}
                      </Text>
                      <Text style={styles.field}>
                        <Text style={styles.bold}>Return Dropoff:</Text> {row.pickup_address} at {formatDateToLocal(row.return_dropoff_dt)}
                      </Text>
                    </>
                  )}
              </View>

              <Text style={[styles.field, styles.credit]}>
                <Text style={styles.bold}>Credit:</Text> ₹ {row.credit_amount ?? 0}
              </Text>

              {row.note && <Text style={styles.note}>Note: {row.note}</Text>}
            </View>
          ))
        )}
      </Page>
    </Document>
  );
}
