# GitHub User Activity CLI

A Node.js command-line interface (CLI) tool that fetches and displays a GitHub user's public activity, leveraging GitHub's REST API. Project idea from [roadmap.sh](https://roadmap.sh/projects/github-user-activity)

## Features
- Fetches the public activity of any GitHub user.
- Displays user activity in a clear and formatted way.
- Supports both CLI commands and modular usage in other Node.js projects.

## Usage

### Prerequisites
- Node.js (v16+ recommended)

### Installation
Clone the repository and navigate to its directory:

```bash
git clone https://github.com/kxng0109/github-user-activity-cli.git
cd github-user-activity-cli
npm install
```

### CLI Usage
To fetch the activity of a specific GitHub user:

```bash
node . github-activity <username>
```

Example:

```bash
node . github-activity michaelthedev
```

This will fetch and display the public activity of the user `michaelthedev`. Special shoutout to [**michaelthedev**](https://github.com/michaelthedev), whose GitHub data was used to structure this tool!

### Programmatic Usage
You can also use this tool as a module in your own Node.js projects:

```javascript
import fetchUser from './src/services/fetchUser.js';

const main = async () => {
    const res = await fetchUser('octocat');
    console.log(res);
};

main();
```

## Technologies Used
- **Node.js**: For the core application.
<!-- - **Jest**: For unit testing. -->

## Roadmap
- [ ] Add tests to catch errors.
- [ ] Add caching for frequent user queries.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License
This project is licensed under the MIT [License](/LICENSE).

---

Made with ❤️ and inspired by [**michaelthedev**'s](https://github.com/michaelthedev) GitHub profile data!

