import { AppBar, Toolbar, Typography } from "@mui/material";
import preval from "preval.macro";
import React from "react";

const Footer = () => {
	const buildVersion = preval`
    const { execSync } = require('child_process')
    module.exports = execSync('npm run -s print-version', {encoding: 'utf-8'})
  `;
	return (
		<>
			<AppBar
				position="static"
				elevation={0}
				component="footer"
				className="footer"
			>
				<Toolbar style={{ justifyContent: "center" }}>
					<Typography variant="caption">
						{" "}
						<p>
							Build: <code className="build-version">{buildVersion}</code>
						</p>
					</Typography>
				</Toolbar>
			</AppBar>
		</>
	);
};

export default Footer;
