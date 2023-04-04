# LookBeforeYou.Link

LookBeforeYou.Link is a web application that allows users to preview the content of a link before clicking it. It provides a concise summary of a website's content, ensuring users know exactly where they're going and what to expect. The application is designed with a playful and fun theme, making it enjoyable to use while promoting a safer browsing experience.

## Features

- Instantly preview the content of a link before clicking
- Get a concise summary of a website's content
- No logs or user information stored
- Interactive and animated user interface
- Supports both server-side and client-side rendering

## How the Code Works

The LookBeforeYou.Link application is built using React, a popular JavaScript library for building user interfaces. It fetches and processes website content to provide users with a summary of the target site's content. Here's a brief overview of how the code works:

**User Interface**: The application has an interactive and animated UI built with React components. Users enter a URL and click the "Leap into Link Safety!" button to initiate the process. The UI also includes an informative demo section that explains the steps involved in generating the content summary.

**Fetching Website Content**: When a user submits a URL, the application sends a request to the server. The server fetches the content of the target website using a combination of headless browser technology (Puppeteer) and standard HTTP requests. This ensures that both static and dynamic websites are supported.

**Processing Content**: Once the website content is fetched, it is processed using Rehype/Remark/Unified, libraries for parsing and manipulating HTML. The code extracts relevant information from the site's content, into trimmed Markdown (can't send too much to openai).

**Generating a Summary**: The extracted content is then converted into a concise summary using a openai. This process maintains the context of the information, ensuring that the summary is both accurate and informative.

**Displaying the Results**: The generated summary is returned in the meta tags. This allows apps like Telegram, Twitter, Discord, etc. to display the information in-line. Users can review the summary before deciding whether to visit the target website.

**Privacy and Security**: The application does not store any logs or user information, ensuring that users can preview links without compromising their privacy or security.

## Known Limitations and Future Improvements

While LookBeforeYou.Link provides a useful service for previewing website content, there are some limitations and areas for improvement:

**Single Page Applications (SPAs)**: Currently, the application uses fetch to retrieve website content, which does not work well with SPAs. Previously, we used headless Chrome, which supports SPAs, but it took too long to spin up. We are exploring alternative solutions for handling SPAs more efficiently.

**Redirection**: When a user clicks on the link to visit the target website, the application performs a fresh analysis to generate meta tags. This could potentially be optimized by testing browser agents and forwarding the user directly to the target site without re-analyzing the content.

- ✅ Mostly-fixed with redis caching.

**More Specific Meta**: We aim to improve the metadata extraction process to provide more specific and accurate information about the target website. This includes refining the algorithm used to generate the content summary.

**Enhanced Visuals**: We are working on adding a more engaging visual element to the application, such as a custom image or graphic, to make the user experience even more enjoyable.

**Error Handling**: Implementing better error handling to provide informative feedback to the user when a URL cannot be processed, such as when the target website is unreachable or the content cannot be parsed.

**Performance**: Continuously working on improving the performance of the application, such as by optimizing server-side processing, caching, and implementing best practices for efficient code execution.

_By addressing these limitations and continuously refining the application, we aim to provide a more robust and enjoyable user experience for previewing website content with LookBeforeYou.Link._

## Getting Started

### Prerequisites

Node.js v18.x
Yarn

### Installation

```bash
yarn i && yarn dev
```

Open your browser and navigate to http://localhost:3000. The application should be running.

### Usage

1. Enter a URL into the input box.
2. Click the "Leap into Link Safety!" button.
3. View the extracted meta tags and content summary.
4. If desired, click the link to be redirected to the target website.

### Contributing

Contributions are welcome! Please read our contributing guidelines for more information on how to contribute to the project.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
