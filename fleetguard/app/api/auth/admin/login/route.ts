import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

interface AdminLoginRequest {
  email: string;
  password: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: AdminLoginRequest = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        {
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await userCredential.user.getIdToken();

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

    if (data.role !== "ADMIN") {
      return Response.json(
        { message: "You are not an Admin." },
        { status: 403 }
      );
    }

    return Response.json({
      message: "Admin login successful",
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