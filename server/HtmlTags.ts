
let scripts = `
	<script defer type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.production.min.js'></script>
	<script defer type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.production.min.js'></script>
	<script defer type='text/javascript' src='/res/main.js'></script>
`;
let styles = `
	<meta name="viewport" content="width=device-width, user-scalable=no"/>
	<link href="https://fonts.googleapis.com/css?family=Signika:300,400,700" rel = "stylesheet" >
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
`;

if (ENV.DEPLOY_TARGET === ENV.TARGET_DEV) {
  styles += `<link rel='stylesheet' type='text/css' href='/res/main.css'>`;
  scripts = `<script src="http://localhost:${+ENV.port + 1}/main.js"></script>`;
} else {
  styles += `<link rel="stylesheet" type="text/css" href="/res/main.css">`;
}

export default { styles, scripts };
