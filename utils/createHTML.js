/**
 * Create HTML Page
 * 
 * @param title {string} - Title of the page
 * 
 * @param content {string} - body content of the page (excluding footer)
 * 
 * @returns {void}
 */
 function createHTML(title, content) {
	return `
		<html>
			<head>
				<meta charset="utf-8">
				<title>${title}</title>
				<link rel="preconnect" href="https://fonts.gstatic.com">
				<link href="https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@600&family=Lato:wght@400&family=Raleway:wght@500&display=swap" rel="stylesheet">
				<style>
					* {
						margin : 0;
						padding : 0;
					}
					
					
					body {
						width : 100vw;
						height : auto;
						overflow-x : hidden;
						background-color : #FFFFFF;
					}
					
					
					header {
						background-color : #505070;
						text-align : center;
					}
					header h1 {
						font-family: 'Baloo Tammudu 2', cursive;
						font-size : 3rem;
						line-height : 0;
						padding : 75px 0;
					}
					
					
					#main {
						padding : 25px 10vw 25px 10vw;
						width : 80vw;
					}
					#main p {
						margin : 25px 0;
						font-family: 'Lato', sans-serif;
						font-size : 1.4rem;
						line-height : 1.4;
						letter-spacing : 0.1px;
					}
					#main a {
						display : block;
						margin : 25px 0;
						font-family: 'Lato', sans-serif;
						font-size : 1.4rem;
						line-height : 1.4;
						letter-spacing : 0.1px;
						background-color : #FFFFFF;
						border : 1px solid #909090;
						cursor : pointer;
						text-decoration : none;
					}
					#main a:hover {
						background-color : #EFEFEF;
					}
					
					
					footer {
						width : 70vw;
						height : 150px;
						border-top : 5px solid #D0D0D0;
						background-color : #FFFFFF;
						position : relative;
						bottom : 0;
						clear : both;
						padding : 0 15vw;
					}
					footer .nav {
						width : 100%;
						margin : 25px 0;
						font-family: 'Raleway', sans-serif;
						text-align:center;
					}
					footer .nav * {
						margin : 0 1px;
					}
					footer .nav span {
						font-size : 1.7rem;
						color : #505050;
					}
					footer .nav a {
						font-size : 1.3rem;
						text-decoration : none;
						color : #303030;
					}
					footer .nav a:hover {
						text-decoration : underline;
					}
					footer .developer-info {
						text-align:center;
					}
					footer p {
						font-family: 'Lato', sans-serif;
						font-size : 1.3rem;
						line-height : 1.7;
						display : inline;
						margin : 0 25px;
					}
					footer svg {
						width : 35px;
						margin : 0 5px;
					}
				</style>
			</head>
			<body>
				${content}
				<footer>
					<div class = "nav">
						<a href = "${domainName}/home">Home</a>
						<span>|</span>
						<a href = "${domainName}/about">About</a>
						<span>|</span>
						<a href = "${domainName}/blog">Blog</a>
						<span>|</span>
						<a href = "${domainName}/stories">Stories</a>
						<span>|</span>
						<a href = "${domainName}/mail-list">Mail</a>
					</div>
					<div class = "developer-info">
						<p>?? Stranothus Studios 2021</p>
						<a href = "" target = "_blank"><svg viewBox="0 0 100 100">
							<path d="M98.849 45.191zM26.042 44.932S12.394 95.218 67.097 95.656c17.163-6.39 29.81-22.054 31.727-40.939.132-1.306.171-2.639.2-3.973.006-.352.053-.693.053-1.046 0-1.521-.093-3.02-.227-4.507-14.452 56.894-78.388 34.61-72.808-.259z" />
							<path d="M54.326 26.267S3.395 12.044 4.178 67.58a49.217 49.217 0 0011.87 17.742c.218.207.444.403.665.606a49.233 49.233 0 004.654 3.793c.253.18.49.38.744.556a48.884 48.884 0 005.373 3.19c.54.278 1.094.532 1.641.791a48.592 48.592 0 004.907 1.991c.41.14.802.315 1.218.446a48.66 48.66 0 006.108 1.444c.624.11 1.256.201 1.888.288 2.142.31 4.302.478 6.467.503.083 0 .163.013.246.013 1.632 0 3.244-.088 4.833-.244-57.146-13.628-35.425-77.529-.466-72.43z" />
							<path d="M74.178 52.604s12.05-50.8-42.19-48.532C13.8 11.257.924 28.954.924 49.694c.017 2.233.185 4.463.504 6.673 11.415-57.474 76.448-38.86 72.75-3.763z" />
							<path d="M48.135 74.465s51.02 6.66 47.827-41.848c-6.944-18.672-24.873-32-45.961-32a49.258 49.258 0 00-8.9.846c56.85 6.979 42.074 73.498 7.034 73.002z" />
							<path d="M64.163 49.7a13.746 13.746 0 11-27.493-.001 13.746 13.746 0 0127.493 0z" />
						</svg></a>
						<a href = "" target = "_blank"><svg viewBox="0 0 28 28">
							<path fill="#14bf96" d="M2.31,5.8A3.56,3.56,0,0,0,.66,8.6V19.4a3.56,3.56,0,0,0,1.65,2.8L12,27.62a3.75,3.75,0,0,0,3.3,0L25,22.2a3.56,3.56,0,0,0,1.65-2.8V8.6A3.56,3.56,0,0,0,25,5.8L15.31.38a3.75,3.75,0,0,0-3.3,0Z" />
							<path fill="#ffffff" d="M23.61,11.32c-5.38,0-9.4,4.46-9.4,9.93v.23H13.13v-.23c0-5.47-4-9.91-9.42-9.93,0,.34,0,.69,0,1a9.91,9.91,0,0,0,6.4,9.32,10.47,10.47,0,0,0,3.59.64,10.64,10.64,0,0,0,3.62-.64,9.92,9.92,0,0,0,6.39-9.32C23.66,12,23.64,11.66,23.61,11.32Z" />
							<circle fill="#ffffff" cx="13.66" cy="8.74" r="3" />
						</svg></a>
						<a href = "" target = "_blank"><svg viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
						</svg></a>
					</div>
				</footer>
			</body>
		</html>`;
}

module.exports = createHTML;