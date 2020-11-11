interface Props {
    dir: vmath.vector3,
    speed: number,
    rank: number,
    range: number,
    type: hash,
}

// Props
go.property("speed", 1);
go.property("rank", 1);
go.property("range", 500);
go.property("type", hash("minigun"));

// Static
const ranks = ["small", "medium", "large"];

export function init(this: Props): void {
    this.dir = vmath.vector3(0, 1, 0);
    if (this.type == undefined) this.type = hash("minigun"); // ? hack: HTML5 props

    let anim = "minigun";
    if (this.type == hash("minigun")) {
        anim = "minigun";
    }
    else if (this.type == hash("proton")) {
        anim = "proton";
    }
    else if (this.type == hash("plasma")) {
        anim = "plasma";
    }
    else if (this.type == hash("laser")) {
        anim = "laser";
    }

    // Set default bullet
    if (this.rank > ranks.length) this.rank = 0;
    msg.post("#left", "play_animation", {id: hash(`${anim}-${ranks[this.rank]}`)});
    msg.post("#right", "play_animation", {id: hash(`${anim}-${ranks[this.rank]}`)});
}

export function update(this: Props, dt: number): void {
    let pos = go.get_position();
    pos = pos + this.dir * this.speed * dt as vmath.vector3;
    go.set_position(pos);

    if (math.abs(pos.y) > this.range) {
        go.delete();
    }
}