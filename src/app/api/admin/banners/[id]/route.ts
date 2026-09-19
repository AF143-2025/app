export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const { id } = params;
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "البانر غير موجود" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.tag !== undefined) updateData.tag = body.tag.trim();
    if (body.offerBadge !== undefined) updateData.offerBadge = body.offerBadge.trim();
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl.trim();
    if (body.targetHref !== undefined) updateData.targetHref = body.targetHref.trim();
    if (body.order !== undefined) updateData.order = parseInt(body.order, 10);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث البانر بنجاح",
      banner,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/banners/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل تحديث البانر" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const { id } = params;
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "البانر غير موجود" },
        { status: 404 }
      );
    }

    await prisma.banner.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "تم حذف البانر بنجاح",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/banners/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل حذف البانر" },
      { status: 500 }
    );
  }
}
