import { forwardRef, Module } from "@nestjs/common";
import { MyGateway } from "./message.gateway";
import { MessagerModule } from "../messager/messager.module";

@Module({
    imports: [
        forwardRef(() => MessagerModule),
    ],
    providers: [MyGateway],
})
export class GatewayModule {}