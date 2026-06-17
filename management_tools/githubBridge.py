import requests
from urllib.parse import urlparse


class GitHubRepoBridge:
    def __init__(self, github_repo_link):
        self._stars = 0
        self._license = ""
        self._url = github_repo_link
        self._queryRepo()

    def _queryRepo(self):
        # Example URL:
        # https://github.com/owner/repo
        parsed = urlparse(self._url)

        path_parts = parsed.path.strip("/").split("/")
        if len(path_parts) < 2:
            raise ValueError("Invalid GitHub repository URL")

        owner, repo = path_parts[0], path_parts[1]

        api_url = f"https://api.github.com/repos/{owner}/{repo}"

        response = requests.get(api_url, timeout=10)
        response.raise_for_status()

        data = response.json()

        self._stars = data.get("stargazers_count", 0)

        license_info = data.get("license")
        self._license = (
            license_info.get("spdx_id", "")
            if license_info
            else ""
        )

    def getStars(self):
        return self._stars

    def getLicense(self):
        return self._license

    def getURL(self):
        return self._url
