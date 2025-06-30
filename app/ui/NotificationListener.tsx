// "use client";
// import { useEffect } from "react";
// import { io } from "socket.io-client";

// export default function NotificationListener() {
//   useEffect(() => {
//     const socket = io("http://localhost:3001"); // Change to your deployed URL if needed
//     socket.on("notification", (data) => {
//       // Show a toast or browser notification
//       if (window.Notification && Notification.permission !== "granted") {
//         Notification.requestPermission();
//         new Notification(data.title, { body: data.message });
//       } else {
//         alert(data.message); // fallback
//       }
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, []);
//   return null;
// }
