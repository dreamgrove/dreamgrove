const axios = require('axios')
const fs = require('fs')

// GitHub repository details
const repoOwner = 'simulationcraft'
const repoName = 'simc'
const filePath = 'SpellDataDump/druid.txt'

// Function to get the latest commit SHA for the specified file
async function getLatestCommitSHA() {
  const latestCommitUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?path=${filePath}&per_page=1`
  const response = await axios.get(latestCommitUrl)
  return response.data[0].sha
}

// Function to get the file content at a specific commit
async function getFileContent(commitSHA) {
  const fileUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${commitSHA}/${filePath}`
  const response = await axios.get(fileUrl)
  return response.data
}

// Main function to perform the tasks
;(async () => {
  try {
    const latestCommitSHA = await getLatestCommitSHA()
    const latestFileContent = await getFileContent(latestCommitSHA)

    // Check if 'druid_latest.txt' exists
    let previousFileContent = ''
    if (fs.existsSync('druid_latest.txt')) {
      previousFileContent = fs.readFileSync('druid_latest.txt', 'utf-8')
    }

    // Save the latest file if it's different
    if (latestFileContent !== previousFileContent) {
      fs.writeFileSync('druid_latest.txt', latestFileContent)
      console.log('Saved latest file as druid_latest.txt')

      // Get the previous commit SHA
      const commitsUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?path=${filePath}&per_page=2`
      const commits = await axios.get(commitsUrl)
      const previousCommitSHA = commits.data[1].sha
      const previousFileContent = await getFileContent(previousCommitSHA)

      // Save the previous file content
      fs.writeFileSync('druid_previous.txt', previousFileContent)
      console.log('Saved previous file as druid_previous.txt')
    } else {
      console.log('No changes detected, no files updated.')
    }
  } catch (error) {
    console.error('Error:', error)
  }
})()
