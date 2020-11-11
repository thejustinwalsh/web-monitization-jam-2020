interface Props {
    dir: vmath.vector3,
    speed: number,
    offset: number,
    tiles: Array<string>,
    index: Array<number>,
}

go.property("speed", 1);
go.property("offset", 400);

export function init(this: Props): void {
    this.dir = vmath.vector3(0, -1, 0);
    this.tiles = ["#bg1", "#bg2", "#bg3", "#bg4"];
    this.index = [0, 1, 2, 3];
}

export function update(this: Props, dt: number): void {
    for (let i = 0; i < this.tiles.length; i++) {
        const tile = this.tiles[i];
        let pos = go.get_position(tile);
        pos = pos + this.dir * this.speed * dt as vmath.vector3;
        go.set_position(pos, tile);
    }

    const trigger = this.tiles[this.index[0]];
    const pos = go.get_position(trigger);
    if (pos.y < 200) {
        const last = this.index.pop();
        if (last != undefined) {
            go.set_position(vmath.vector3(0, pos.y + this.offset, 0), this.tiles[last]);
            this.index = [last].concat(...this.index);
        }
    }
}