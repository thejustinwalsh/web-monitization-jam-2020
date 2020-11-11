interface Props {
    dir: vmath.vector3,
    speed: number,
    padding: number,
    bounds: vmath.vector3
}

go.property("speed", 1);
go.property("padding", 32);
go.property("bounds", vmath.vector3(160, 183, 0));

export function init(this: Props): void {
    this.dir = vmath.vector3(0, -1, 0);

    if (this.bounds == undefined) this.bounds = vmath.vector3(160, 183, 0);  // ? hack: HTML5 props
}

export function update(this: Props, _dt: number): void {
    //
}

function spawn(self: Props, formation: string, speed: number): void {
    const pos = go.get_position();
    pos.x = -self.bounds.x;
    formation.split('').forEach(c => {
        const rank = tonumber(c);
        if (rank != undefined) factory.create("#enemies", pos, undefined, { speed, rank });
        pos.x += self.padding;
    });
}

interface MsgProps { formation: string, speed: number }
export function on_message(this: Props, messageId: hash, message: MsgProps, _sender: url): void {
    if (messageId == hash("spawn")) spawn(this, message.formation, message.speed);
}