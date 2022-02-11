// run with 
//     deno run --allow-all build.js

console.log("Build starting...")
console.log(`Current OS: ${Deno.build.os}`)

Deno.mkdir("build").catch(() => {});
if (Deno.build.os === "windows") {
	await winBuild();
} else {
	await otherBuild();
}

async function winBuild() {
	const p = Deno.run({
  		cmd: ["cmake", "-DCMAKE_CXX_COMPILER=cl.exe -A x64", ".."],
		cwd: "build"
	});

	await p.status();

	const p2 = Deno.run({
		cmd: ["cmake", "--build", ".", "--", "/property:Configuration=Release"],
		cwd: "build"
	});

	await p2.status();
}

async function otherBuild() {
	const p = Deno.run({
  		cmd: ["cmake", "-G Ninja", ".."],
		cwd: "build"
	});

	await p.status();

	const p2 = Deno.run({
		cmd: ["cmake", "--build", ".", "--config", "Release"],
		cwd: "build"
	});

	await p2.status();
}
