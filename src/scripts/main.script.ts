import * as console from "defcon.console";
import * as data from "../modules/data";
import * as tasks from "../modules/tasks";

export function init(this: unknown): void {
	if (console != undefined && sys.get_engine_info().is_debug) {  // eslint-disable-line
		console.start(8098);


		console.register_command("set_player_props", "rank=1, type=minigun", (args, _stream) => {
			args.forEach(a => {
				const command = a.split("=");
				if (command.length > 1) {
					if (command[0] == "rank") msg.post("/player#player", hash("rank"), {rank: command[1]});
					if (command[0] == "type") msg.post("/player#player", hash("type"), {type: command[1]});
				}
			});
			return "";
		});

		console.register_command("wave", "formation, speed", (args, _stream) => {
			let formation = args.length > 0 ? args[0] : "000";
			formation = formation.split("").filter(c => c != '"').join("");
			let speed = args.length > 1 ? tonumber(args[1]) : 100;
			speed = speed == undefined ? 100 : speed;
			msg.post("/wave-spawner#spawner", hash("spawn"), { formation, speed });
			return `wave: { formation: ${formation}. speed: ${speed} }`;
		});
		
	}

	if (webmonetization != null) {
		const monetized = webmonetization.is_monetized();

		if (monetized) {
			print("The user has an active payment stream");
		}

		webmonetization.set_listener(function(this: unknown, event: webmonetization.Event, details?: webmonetization.EventDetails) {
			if (event == webmonetization.EVENT_PENDING) {
				print("The user is trying to make a first payment");
			} else if (event == webmonetization.EVENT_START) {
				print("The user has started paying");
			} else if (event == webmonetization.EVENT_PROGRESS) {
				print("The user is still paying");
			} else if (event == webmonetization.EVENT_STOP) {
				print("The user has stopped paying");
			}
			print(details?.requestId);
		});
	}

	tasks.task(1, () => {
		const waveset = [...data.wavesets[0], ...data.wavesets[0], ...data.wavesets[0], ...data.wavesets[0]];
		waveset.forEach(wave => {
			msg.post("/wave-spawner#spawner", hash("spawn"), { formation: wave.formation, speed: 100 });
			coroutine.yield();
		});
	});
}

export function final(this: unknown): void {
	if (console != undefined && sys.get_engine_info().is_debug) {  // eslint-disable-line
		console.stop();
	}
	
}

export function update(this: unknown, dt: number): void {
	if (console != undefined && sys.get_engine_info().is_debug) {  // eslint-disable-line
		console.update();
	}

	tasks.update(dt);
}

export function on_message(this: unknown, _message_id: hash, _message: string, _sender: url): void {
	// Add message-handling code here
	// Learn more: https://defold.com/manuals/message-passing/
	// Remove this function if not needed
}

export function on_input(this: unknown, _action_id: hash, _action: hash): void {
	// Add input-handling code here. The game object this script is attached to
	// must have acquired input focus:
	//
	//    msg.post(".", "acquire_input_focus")
	//
	// All mapped input bindings will be received. Mouse and touch input will
	// be received regardless of where on the screen it happened.
	// Learn more: https://defold.com/manuals/input/
	// Remove this function if not needed
}

export function on_reload(this: unknown): void {
	// Add reload-handling code here
	// Learn more: https://defold.com/manuals/hot-reload/
	// Remove this function if not needed
}
