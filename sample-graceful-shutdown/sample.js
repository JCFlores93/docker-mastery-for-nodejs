// place this code in your node app, ideally in index.js or ./bin/www
// 
// you need this code so node will watch for exit signals
// node by default doesn't handle SIGINT/SIGTERM
// docker containers use SIGINT and SIGTERM to properly exit
//
// signals also aren't handeled by npm:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process, just a forced exit
//

// Docker uses Linux signals to stop app(SIGINT/SIGTERM/SIGKILL)
// SIGINT/SIGTERM allow graceful stop
// npm doesn't respond to SIGINT/SIGTERM
// node doesn't respond by default, but can with node
// Docker provides a init PID 1 replacement option

// First option 
// Run any node app with --init to handle signals(temp solution)
// docker run --init -d nodeapp

// Second option
// Add tini to your Dockerfile, then use it in CMD(permanent workaround)
//> RUN apk add --no-cache tini
//> ENTRYPOINT ["/sbin/tini", "--"]
//> CMD ["node", "./bin/www"]

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
  shutdown();
})

// shut down server
function shutdown() {
  // NOTE: server.close is for express based apps
  // If using hapi, use `server.stop`
  server.close(function onServerClosed (err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
		}
		process.exit();
  })
}
