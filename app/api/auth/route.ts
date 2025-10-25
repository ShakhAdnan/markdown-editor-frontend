import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod on server
    const validatedData = signupSchema.parse(body);

    // Your signup logic here
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
