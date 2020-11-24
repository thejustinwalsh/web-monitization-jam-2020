interface Props {
    player: string,
    type: hash,
    input: vmath.vector3,
    dir: vmath.vector3,
    speed: number,
    moving: boolean,
    firing: boolean,
    anim: string,
    bounds: vmath.vector3,
    bulletRank: number,
    bulletType: hash,
    fireTimer: number,
    fireDelay: number,
    repeatDelay: number
}

go.property("speed", 10);
go.property("type", hash("player-blue"));
go.property("bounds", vmath.vector3(160, 183, 0));
go.property("fireDelay", .33);
go.property("repeatDelay", .1);

const fire = (pos: vmath.vector3, rank: number, type: hash) => factory.create("#bullets", pos, undefined, { rank, type, speed: 500 });

export function init(this: Props): void {
    msg.post(".", "acquire_input_focus");

    if (this.type == undefined) this.type = hash("player-blue");  // ? hack: HTML5 props
    if (this.bounds == undefined) this.bounds = vmath.vector3(160, 183, 0);  // ? hack: HTML5 props
    if (this.fireDelay == undefined) this.fireDelay = .16; // ? hack: HTML5 props

    this.input = vmath.vector3();
    this.dir = vmath.vector3(0, 1, 0);

    this.player = "player-blue";
    if (this.type == hash("player-blue")) this.player = "player-blue";
    if (this.type == hash("player-red")) this.player = "player-red";

    this.bulletRank = 0;
    this.bulletType = hash("plasma");

    this.fireTimer = 0;
}

export function final(): void {
    msg.post(".", "release_input_focus");
}

export function update(this: Props, dt: number): void {
    if (this.moving) {
        let pos = go.get_position();
        pos = pos + this.dir * this.speed * dt as vmath.vector3;
        pos.x = math.min(math.max(pos.x, -this.bounds.x), this.bounds.x);
        pos.y = math.min(math.max(pos.y, -this.bounds.y), this.bounds.y);
        go.set_position(pos);

        const anim = this.dir.x < 0 ? "left" : this.dir.x > 0 ? "right" : "idle";
        if (this.anim != anim) {
            msg.post(`#${this.player}`, "play_animation", {id: hash(`${this.player}-${anim}`)});
            msg.post("#player-shadow", "play_animation", {id: hash(`player-shadow-${anim}`)});
            this.anim = anim;
        }
    }
    else if (this.anim != "idle") {
        msg.post(`#${this.player}`, "play_animation", {id: hash(`${this.player}-idle`)});
        msg.post("#player-shadow", "play_animation", {id: hash(`player-shadow-idle`)});
        this.anim = "idle";
    }

    if (this.firing) {
        this.fireTimer -= dt;
        if (this.fireTimer <= 0) {
            this.fireTimer += this.repeatDelay;
            fire(go.get_position(), this.bulletRank, this.bulletType);
        }
    }

    this.input.x = 0;
    this.input.y = 0;
    this.moving = false;
}

interface InputAction { pressed: boolean, released: boolean }

export function on_input(this: Props, actionId: hash, action: InputAction): void {
    if (actionId == hash("forward")) {
        this.input.y = 1;
    }
    else if (actionId == hash("backward")) {
        this.input.y = -1;
    }
    else if (actionId == hash("left")) {
        this.input.x = -1;
    }
    else if (actionId == hash("right")) {
        this.input.x = 1;
    }
    else if (actionId == hash("fire") && action.pressed) {
        this.firing = true;
        this.fireTimer = this.fireDelay;
        fire(go.get_position(), this.bulletRank, this.bulletType);
    }
    else if (actionId == hash("fire") && action.released) {
        this.firing = false;
    }

    if (vmath.length(this.input) > 0) {
        this.moving = true;
        this.dir = vmath.normalize(this.input);
    }
}

export function on_message(this: Props, messageId: hash, message: unknown, _sender: url): void {
	if (messageId == hash("rank")) {
        const msgRank = message as { rank: string, type: string };
        this.bulletRank = ["0", "1", "2"].indexOf(msgRank.rank);
    }
    else if (messageId == hash("type")) {
        const msgRank = message as { rank: string, type: string };
        this.bulletType = hash(msgRank.type);
    }
}