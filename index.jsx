import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Redirect to the appropriate dashboard based on user role
        if (user.email.endsWith("@student.edu")) {
          router.push("/student/login");
        } else if (user.email.endsWith("@faculty.edu")) {
          router.push("/faculty/login");
        } else if (user.email.endsWith("@admin.edu")) {
          router.push("/admin/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Student Auth Portal</h1>
      <p>Please log in or register to continue.</p>
    </div>
  );
}