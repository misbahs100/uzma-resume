"use client";

import {
  ArrowLongRightIcon,
  ArrowUturnRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PencilIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { UpdateBookingModal } from "./update-booking-modal";
import { BookingForm } from "@/app/lib/definitions";
import { formatDateToLocal } from "@/app/lib/utils";
import { PrintDeliveryChallanButton, PrintDevitVoucherButton } from "./buttons";

export default function BookingsTable({
  bookings,
}: {
  bookings: BookingForm[];
}) {
  const [showUpdateBookingModal, setShowUpdateBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingForm | null>(
    null
  );

  return (
    <>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {/* Mobile View */}
            <div className="md:hidden">
              {bookings?.map((booking) => (
                <div
                  key={booking.id}
                  className="mb-2 w-full rounded-md bg-white p-4 shadow-sm border"
                >
                  {/* id and time */}
                  <div className="mb-2">
                    <span className="text-xs">{booking.id}</span> <br />
                    <span className="text-xs text-gray-500">
                      Issued at {formatDateToLocal(booking.created_at)}.
                    </span>
                    {booking?.updated_at ? (
                      <>
                        <span className="text-xs text-gray-500">
                          {" "}
                          Updated at {formatDateToLocal(booking.updated_at)}
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* Header */}
                  <div className="mb-2 flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{booking.vehicle}</p>
                    </div>
                    {/* edit and print buttons */}
                    <div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          className="flex items-center space-x-1 text-sm font-medium text-teal-400 hover:text-teal-700"
                          onClick={() => {
                            setShowUpdateBookingModal(true);
                            setSelectedBooking(booking);
                          }}
                        >
                          <PencilIcon
                            className="w-5 h-5"
                            title="Edit Challan"
                          />
                        </button>
                      </div>
                      {showUpdateBookingModal &&
                      selectedBooking &&
                      selectedBooking.id === booking.id ? (
                        <UpdateBookingModal
                          setShowUpdateBookingModal={setShowUpdateBookingModal}
                          booking={booking}
                        />
                      ) : null}
                    </div>
                  </div>

                  {/* Pickup → Deliveries → Dropoff */}
                  <div className="mb-3 text-sm space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                      {/* Pickup Address */}
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-4 h-4 text-emerald-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {booking.pickup_address}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <CalendarDaysIcon className="w-3 h-3" />
                            {formatDateToLocal(booking.pickup_dt)}
                          </p>
                        </div>
                      </div>

                      {/* Deliveries */}
                      {Array.isArray(booking?.deliveries)
                        ? booking.deliveries.map((delivery: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 border-l sm:border-l-0 sm:border-t sm:pt-2 sm:mt-2 pl-3 sm:pl-0"
                            >
                              <ArrowLongRightIcon className="w-5 h-5 text-blue-500 mt-1" />
                              <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {delivery.customer}
                                </p>
                                <div className="flex space-x-4">
                                  <p className="text-xs text-gray-500">
                                    {delivery.customer_address}
                                  </p>
                                  <PrintDeliveryChallanButton
                                    delivery={delivery}
                                    booking={booking}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        : typeof booking?.deliveries === "string" &&
                          Array.isArray(JSON.parse(booking.deliveries)) &&
                          JSON.parse(booking.deliveries).map(
                            (delivery: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 border-l sm:border-l-0 sm:border-t sm:pt-2 sm:mt-2 pl-3 sm:pl-0"
                              >
                                <ArrowLongRightIcon className="w-5 h-5 text-blue-500 mt-1" />
                                <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {delivery.customer}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {delivery.customer_address}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                    </div>
                  </div>

                  {/* Return Leg */}
                  {booking.booking_type === "return" &&
                    booking.return_pickup_dt &&
                    booking.return_dropoff_dt && (
                      <div className="mb-2 text-sm border-t border-gray-200 pt-3 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                          <div className="flex items-start gap-2">
                            <ArrowUturnRightIcon className="w-4 h-4 text-amber-500 mt-1" />
                            <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                            <div>
                              <p className="font-medium text-gray-800">
                                Return Pickup
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <CalendarDaysIcon className="w-3 h-3" />
                                {formatDateToLocal(booking.return_pickup_dt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Details */}
                  <div className="mb-2 text-sm">
                    <p>Driver: {booking.driver}</p>
                    {booking.note && <p>Note: {booking.note}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium">#</th>
                  <th className="px-3 py-5 font-medium">Vehicle</th>
                  <th className="px-3 py-5 font-medium">Pickup / Dropoff</th>
                  <th className="px-3 py-5 font-medium">Cr / Dr</th>
                  <th className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-sm">
                {bookings?.map((booking) => (
                  <Fragment key={booking.id}>
                    <tr
                      key={booking.id}
                      className="border-t first-of-type:border-none"
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="text-xs">{booking.id}</span> <br />
                        <span className="text-xs text-gray-500">
                          Issued at {formatDateToLocal(booking.created_at)}
                        </span>
                        {booking?.updated_at ? (
                          <>
                            <br />
                            <span className="text-xs text-gray-500">
                              Updated at {formatDateToLocal(booking.updated_at)}{" "}
                              by {booking.updated_by}
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {booking.vehicle}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <TruckIcon className="w-4 h-4 text-teal-500" />
                          {booking.driver}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4">
                        <span className="flex items-center">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {formatDateToLocal(booking.pickup_dt)}
                        </span>
                        <span className="flex items-center ml-3">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {formatDateToLocal(booking.dropoff_dt)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-center">
                        {booking.credit_amount ? booking.credit_amount : 0} /{" "}
                        {(Array.isArray(booking.delivery_costs_data)
                          ? booking.delivery_costs_data
                          : typeof booking.delivery_costs_data === "string" &&
                            Array.isArray(
                              JSON.parse(booking.delivery_costs_data)
                            )
                          ? JSON.parse(booking.delivery_costs_data)
                          : []
                        ).reduce(
                          (acc: any, item: { cost: any }) => acc + item.cost,
                          0
                        )}
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            className="flex items-center space-x-1 text-sm font-medium text-teal-400 hover:text-teal-700"
                            onClick={() => {
                              setShowUpdateBookingModal(true);
                              setSelectedBooking(booking);
                            }}
                          >
                            <PencilIcon
                              className="w-5 h-5"
                              title="Edit Challan"
                            />
                          </button>

                          <PrintDevitVoucherButton booking={booking} />
                        </div>
                        {showUpdateBookingModal &&
                        selectedBooking &&
                        selectedBooking.id === booking.id ? (
                          <UpdateBookingModal
                            setShowUpdateBookingModal={
                              setShowUpdateBookingModal
                            }
                            booking={booking}
                          />
                        ) : null}
                      </td>
                    </tr>

                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 pb-2 whitespace-pre-wrap break-words"
                      >
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-gray-800">
                          {/* Pickup */}
                          <span className="font-medium text-gray-700">
                            {booking.pickup_address}
                          </span>

                          {/* Dropoffs */}
                          {Array.isArray(booking.deliveries) &&
                            booking.deliveries.map((delivery, idx) => (
                              <Fragment key={delivery.id || idx}>
                                <ArrowLongRightIcon className="w-4 h-4 text-blue-500 mx-1" />

                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="font-semibold text-gray-800">
                                    {delivery.customer_address}
                                  </span>
                                  <span className="text-gray-500 font-medium">
                                    ({delivery.customer})
                                  </span>

                                  <PrintDeliveryChallanButton
                                    delivery={delivery}
                                    booking={booking}
                                  />
                                </div>
                              </Fragment>
                            ))}
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
