import { supabase } from "@/lib/supabase";

interface ApproveFleetManagerRequest {
  email: string;
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const body: ApproveFleetManagerRequest = await req.json();

    const { email } = body;

    if (!email) {
      return Response.json(
        {
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        status: "APPROVED",
      })
      .eq("email", email)
      .select();

    if (error) {
      return Response.json(
        {
          message: error.message,
        },
        { status: 400 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        {
          message: "Fleet Manager not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Fleet Manager approved",
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