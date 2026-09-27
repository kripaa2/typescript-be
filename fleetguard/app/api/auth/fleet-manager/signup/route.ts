import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

interface FleetManagerSignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: FleetManagerSignupRequest = await req.json();

    const {
      name,
      email,
      password,
      phone,
    } = body;

    if (!name || !email || !password || !phone) {
      return Response.json(
        {
          message: "Name, email, password and phone are required",
        },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUid = userCredential.user.uid;

    const { error } = await supabase
      .from("users")
      .insert({
        firebase_uid: firebaseUid,
        full_name: name,
        email,
        phone,
        role: "FLEET_MANAGER",
        status: "PENDING",
      });

    if (error) {
      return Response.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return Response.json({
      message: "Waiting for admin approval",
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