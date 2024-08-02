const axios = require('axios')
const fs = require('fs')
const path = require('path')

const owner = 'simulationcraft'
const repo = 'simc'
const branch = 'thewarwithin'
const filePath = 'SpellDataDump/druid.txt'
const outputDir = './news'

const downloadFile = async (url, outputPath) => {
  try {
    const response = await axios.get(url)
    fs.writeFileSync(outputPath, response.data)
    console.log(`File downloaded to ${outputPath}`)
  } catch (error) {
    console.error(`Failed to download file: ${error}`)
  }
}

const getPreviousCommitSha = async (currentCommitSha) => {
  try {
    // Fetch all commits from the specified branch
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`
    const response = await axios.get(url)
    const commits = response.data

    console.log(`Total commits fetched: ${commits.length}`)
    commits.forEach((commit, index) => {
      console.log(`Commit ${index}: SHA: ${commit.sha}, Message: ${commit.commit.message}`)
    })

    // Find the commit before the current one
    const currentIndex = commits.findIndex((commit) => commit.sha === currentCommitSha)
    console.log(`Current commit index: ${currentIndex}`)
    if (currentIndex !== -1 && currentIndex < commits.length - 1) {
      return commits[currentIndex + 1].sha
    }
  } catch (error) {
    console.error(`Failed to get previous commit SHA: ${error}`)
  }

  return null
}

const main = async () => {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Download the latest file
  const latestFileUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
  const latestOutputPath = path.join(outputDir, 'druid_latest.txt')
  await downloadFile(latestFileUrl, latestOutputPath)

  // Get the latest commit SHA
  const commitUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`
  const commitResponse = await axios.get(commitUrl)
  const latestCommitSha = commitResponse.data[0].sha

  console.log(`Latest commit SHA: ${latestCommitSha}`)

  // Get the previous commit SHA
  const previousCommitSha = await getPreviousCommitSha(latestCommitSha)
  if (previousCommitSha) {
    console.log(`Previous commit SHA: ${previousCommitSha}`)
    // Download the file from the previous commit
    const previousFileUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${previousCommitSha}/${filePath}`
    const previousOutputPath = path.join(outputDir, 'druid_previous.txt')
    await downloadFile(previousFileUrl, previousOutputPath)
  } else {
    console.log('No previous commit found.')
  }
}

main()
