import { auth, getUser } from "@/auth";
// import NotificationListener from "@/app/ui/NotificationListener";
import SideNav from "../ui/dashboard/sidenav";
import TopNav from "../ui/dashboard/topnav";
import { getOfficeFromSession } from "../lib/session/officeSession";
import { fetchOffices } from "../lib/data";

// export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userInfo = null;
  if (session?.user?.email) {
    userInfo = await getUser(session.user.email);
  }
  const offices = await fetchOffices();
  const currentOffice = await getOfficeFromSession();
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {userInfo && <TopNav userInfo={userInfo} offices={offices} currentOffice={currentOffice} />}
        {/* Request notification permission on mount */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.Notification && Notification.permission !== "granted") {
                Notification.requestPermission();
              }
            `,
          }}
        />
        {/* <NotificationListener /> */}
        {children}
      </div>
    </div>
  );
}
