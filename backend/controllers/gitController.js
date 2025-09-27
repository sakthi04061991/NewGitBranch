const {exec} = require("child_process")
const repoPath = "/var/www/html/ERP";

const CheckMyBranch = (req,res) => {
	exec(`git rev-parse --abbrev-ref HEAD`, {cwd: repoPath}, (err, stdout, stderr) => {
		if(err) return res.status(500).json({err:stderrm || err.message});

		const branch = stdout.trim();
		res.json({branch});
	})
}

const CreateNewBranch = (req,res) => {
	const {branchName} = req.body;
	if(!branchName) return res.status(400).json({error:"branch name is required"})
	exec(`git checkout -b ${branchName}`,{cwd: repoPath}, (err,stdout, stderr) => {
		if(err) return res.status(500).json({err:stderr || err.message})
		
		res.json({message: "New Branch Created"});
	})
}

const ChangeBranch = (req,res) => {
	const {branchName} = req.body;
	exec(`git checkout ${branchName}`,{cwd: repoPath}, (err,stdout, stderr) => {
                if(err) return res.status(500).json({err:stderr || err.message})
                res.json({message: `Your ${branchName} is changed`});
        })
}

const GitDiff = (req,res) => {
	const {filepath} = req.body;
	exec(`git diff ${filepath}`, { cwd: repoPath }, (err, stdout, stderr) => {
		if (err) return res.status(500).json({ error: stderr || err.message });
		if (!stdout) return res.json({ diffFiles: [] });
		const filesDiff = stdout.split(/^diff --git /gm).filter(Boolean).map((diffText) => "diff --git " + diffText);
    		res.json({ diffFiles: filesDiff });
	})
}

const GitAdd = (req, res) => {
	const {filepath} = req.body;
	if (!filepath) return res.status(400).json({ error: "filePath is required" });

  	exec(`git add ${filepath}`, { cwd: repoPath }, (err, stdout, stderr) => {
    		if (err) return res.status(500).json({ error: stderr || err.message });
    		res.json({ message: `File ${filepath} added successfully` });
  	});
}

const gitCommit  = (req,res) => {
	const {message} = req.body;
	if(!message) return res.status(400).json({error: "Commit Message is required"});
	exec(`git commit -m "${message}"`, { cwd: repoPath }, (err, stdout, stderr) => {
		if (err) return res.status(500).json({ error: stderr || err.message });
		res.json({ message: stdout || `Committed with message: "${message}"` });
	})

}

const gitPush = (req,res) => {
  	exec(`git push origin HEAD`, { cwd: repoPath }, (err, stdout, stderr) => {
		console.log(err)
    		if (err) return res.status(500).json({ error: stderr || err.message });
    		res.json({ message: stdout || `Successfully pushed branch` });
  	});
}
module.exports = {CheckMyBranch, CreateNewBranch, ChangeBranch,GitDiff, GitAdd, gitCommit, gitPush}
