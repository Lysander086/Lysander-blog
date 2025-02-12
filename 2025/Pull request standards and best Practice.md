# Description
To make sure that we have a more fluent PR review procedures, please contribute your ideas here to facilitate a smoother reviewer process.

Please feel free to contribute here and bring team members to consensus about what could be regarded as good practices and what should be followed in the future.


# References
- https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes
- https://medium.com/deliveryherotechhub/good-manners-of-a-pull-request-some-best-practices-cb2de3c3aea1 

# A general summary guideline summarized from the above references.

# General info to provide during PR creation
1. Purpose of PR creation

- Clearly State the Objective: Begin by succinctly explaining the primary goal of the PR. This helps reviewers grasp the intent behind the changes.

Example: “This PR implements feature X to improve user authentication by adding two-factor authentication support.”

2. Summary of Changes

- Concise Overview: Provide a summary of the modifications made, focusing on the most significant changes.

Example: “Added a new module for two-factor authentication, updated the login controller to handle the new authentication flow, and modified the user model to include a two-factor authentication flag.”

3. Related Issues

- Link Relevant Issues or Discussions: Connect the PR to associated issues or previous discussions to provide context. This can be done by referencing issue numbers or linking directly to them.

Example: “#1234.”

4. Reviewer instructions

- Describe Testing Procedures and Outcomes: Detail the tests performed to ensure the changes work as intended. Include information on unit tests, integration tests, and any manual testing conducted.

Example: “Executed unit tests for the new authentication module, all of which passed. Conducted manual testing of the login process to verify two-factor authentication prompts appear as expected.”

5. Additional Context

- Provide Extra Information for Reviewers: Offer any additional details that might assist reviewers in understanding the changes. This could include design decisions, potential impacts on other parts of the system, or areas where specific feedback is requested.

Example: “This implementation follows the design pattern discussed in [link to design document]. Feedback is particularly welcome on the approach taken for handling backup codes.”

By adhering to these guidelines, your PRs will be more informative and reviewer-friendly, promoting efficient collaboration and high-quality code reviews.


# Best practices summarized from the internet. 

To enhance the effectiveness of your pull requests (PRs), consider incorporating the following best practices:

**1. Write Small, Focused PRs**

- **Keep PRs Concise**: Aim to create small, focused pull requests that fulfill a single purpose. Smaller pull requests are easier and faster to review and merge, leave less room to introduce bugs, and provide a clearer history of changes. ([docs.github.com](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes?utm_source=chatgpt.com))

**2. Perform a Self-Review Before Submission**

- **Review Your Own Work**: Review, build, and test your own pull request before submitting it. This will allow you to catch errors or typos that you may have missed, before others start reviewing. ([docs.github.com](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes?utm_source=chatgpt.com))

**3. Provide Clear Context and Guidance**

- **Detailed Descriptions**: Write clear titles and descriptions for your pull requests so that reviewers can quickly understand what the pull request does. In the pull request body, include:

  - The purpose of the pull request
  - An overview of what changed
  - Links to any additional context such as tracking issues or previous conversations

  To help reviewers, share the type of feedback you need. For example, do you need a quick look or a deeper critique? ([docs.github.com](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes?utm_source=chatgpt.com))

**4. Keep Your Team Informed**

- **Link to Related Issues or Projects**: Connect your pull request to relevant issues or project boards to show how your work fits into the larger project.

  - Add keywords like `Closes ISSUE-LINK` in your description to automatically link and close the issue when the pull request is merged.
  - Use Projects to track your work and link to the project from your pull request, making progress easy to track in one place. ([docs.github.com](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes?utm_source=chatgpt.com))

- **Highlight the Status with Labels**: Add a status label to your pull request to show whether it’s ready for review, blocked, or in progress. This helps reviewers understand the state of your work at a glance. ([docs.github.com](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes?utm_source=chatgpt.com))

By integrating these practices into your PR process, you can improve collaboration, streamline reviews, and maintain high code quality. 


# Issues that I found during stacked PR
- I need to apply duplicate changse to the code. 
  - examples: merge from the main to the current branch.
  - The update branch button of GitHub no long works since we stack them.

