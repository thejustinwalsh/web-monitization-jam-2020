interface Props {
    dir: vmath.vector3,
    speed: number,
    rank: number,
    range: number,
    type: hash,
}

// Props
go.property("speed", 100);
go.property("rank", 0);
go.property("range", 264);
go.property("type", hash("enemy1"));

// Static
const ranks = ["green", "red", "teal"];
const types = ["enemy1", "enemy2"];
const t = types.map(t => hash(t));

export function init(this: Props): void {
    this.dir = vmath.vector3(0, -1, 0);
    if (this.type == undefined) this.type = t[0]; // ? hack: HTML5 props

    if (this.rank > ranks.length) this.rank = 0;
    const anim = `${types[t.indexOf(this.type)]}-${ranks[this.rank]}-idle`;
    
    msg.post("#enemy", "play_animation", {id: hash(anim) });
}

export function update(this: Props, dt: number): void {
    let pos = go.get_position();
    pos = pos + this.dir * this.speed * dt as vmath.vector3;
    go.set_position(pos);

    if (pos.y < -this.range) {
        go.delete();
    }
}