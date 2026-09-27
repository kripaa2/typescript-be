import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: LoginRequest = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        {
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Firebase authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await userCredential.user.getIdToken();

    // Find user in database
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("firebase_uid", userCredential.user.uid)
      .single();

    if (error || !data) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Role check
    if (data.role !== "DRIVER") {
      return Response.json(
        { message: "You are not a Driver." },
        { status: 403 }
      );
    }

    // Status check
    if (data.status === "PENDING") {
      return Response.json(
        { message: "Waiting for admin approval" },
        { status: 403 }
      );
    }

    if (data.status === "REJECTED") {
      return Response.json(
        { message: "Account rejected" },
        { status: 403 }
      );
    }

    return Response.json({
      message: "Login successful",
      token,
      user: data,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    return Response.json(
      { message },
      { status: 400 }
    );
  }
}