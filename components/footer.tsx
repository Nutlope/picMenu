import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-500">
              Powered by{" "}
              <a
                href="https://togetherai.link/?utm_source=picMenu&utm_medium=referral&utm_campaign=example-app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors  underline-offset-4 underline"
              >
                Together AI
              </a>
              . Created by{" "}
              <a
                href="https://x.com/nutlope"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors  underline-offset-4 underline"
              >
                Hassan.
              </a>
            </p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://github.com/Nutlope/picmenu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaGithub className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://x.com/nutlope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaTwitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://linkedin.com/in/nutlope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaLinkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
