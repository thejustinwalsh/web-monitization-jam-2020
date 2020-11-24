interface Props {
    dir: vmath.vector3,
    speed: number,
    rank: number,
    range: number,
    type: hash,
    health: number,
    dead: boolean
}

// Props
go.property("speed", 100);
go.property("rank", 0);
go.property("range", 264);
go.property("type", hash("enemy1"));
go.property("health", 1);
// Static
const ranks = ["green", "red", "teal"];
const types = ["enemy1", "enemy2"];
const t = types.map(t => hash(t));

export function init(this: Props): void {
    this.dir = vmath.vector3(0, -1, 0);
    if (this.type == undefined) this.type = t[0]; // ? hack: HTML5 props

    if (this.rank > ranks.length) this.rank = 0;
    const anim = `${types[t.indexOf(this.type)]}-${ranks[this.rank]}-idle`;
    
    this.dead = false;

    msg.post("#enemy", "play_animation", {id: hash(anim) });
}

export function update(this: Props, dt: number): void {
    if (this.dead == true) return;

    let pos = go.get_position();
    pos = pos + this.dir * this.speed * dt as vmath.vector3;
    go.set_position(pos);

    if (pos.y < -this.range) {
        go.delete();
    }
}

export function on_message(this: Props, messageId: hash, message: unknown, _sender: url): void {
    if (messageId == hash("collision_response")) {
        const colMsg = message as { other_id: hash, other_position: vmath.vector3, other_group: hash };
        this.health -= 1;

        if (!this.dead && this.health <= 0) {
            this.dead = true;
            msg.post("#collision", "disable");
            msg.post("#enemy", "play_animation", {id: hash("explosion-red") });
            go.delete(colMsg.other_id);
        }
    }
    else if (messageId == hash("animation_done")) {
        const animDoneMsg = message as { current_tile: hash, id: hash };
        if (animDoneMsg.id == hash("explosion-red")) {
            go.delete();
        }
    }
}