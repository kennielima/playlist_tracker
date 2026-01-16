import { SYS_ADMIN_EMAIL } from "../lib/config";
import prisma from "../lib/prisma";

export async function getSysAdmin() {
    return await prisma.user.findUnique({
        where: { email: SYS_ADMIN_EMAIL }
    })
}