import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Highlight, themes } from 'prism-react-renderer'
import { format } from 'date-fns'
import Table from 'react-bootstrap/Table'

export const MessageBubble = ({
  message,
  isUser,
  timestamp
}) => (
  <div className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
    <div style={{ maxWidth: '75%' }} className={isUser ? 'ms-5' : 'me-5'}>
      <div
        className={
          `rounded px-3 py-2 ${
            isUser
              ? 'bg-primary text-white'
              : 'bg-light text-dark'
          }`
        }
      >
        {
          isUser ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={
                  {
                    code({
                      node, className, children, ...props
                    }) {
                      const match = /language-(\w+)/.exec(className || '')
                      const language = match ? match[1] : ''

                      return match ? (
                        <Highlight
                          theme={themes.github}
                          code={String(children).replace(/\n$/, '')}
                          language={language}
                        >
                          {
                            ({
                              className, style, tokens, getLineProps, getTokenProps
                            }) => (
                              <pre className={`${className} p-3 rounded overflow-auto`} style={style}>
                                {
                                  tokens.map((line, i) => (
                                    <div key={i} {...getLineProps({ line })}>
                                      {
                                        line.map((token, key) => (
                                          <span key={key} {...getTokenProps({ token })} />
                                        ))
                                      }
                                    </div>
                                  ))
                                }
                              </pre>
                            )
                          }
                        </Highlight>
                      ) : (
                        <code className={`${className} bg-dark text-light rounded px-1 small`} {...props}>
                          {children}
                        </code>
                      )
                    },
                    table: ({ children }) => (
                      <div className="table-responsive">
                        <Table striped bordered hover size="sm">
                          {children}
                        </Table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="bg-light small">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="small">
                        {children}
                      </td>
                    )
                  }
                }
              >
                {message}
              </ReactMarkdown>
            </div>
          )
        }
      </div>
      {
        timestamp && (
          <div className={
            `text-muted small mt-1 ${
              isUser ? 'text-end' : 'text-start'
            }`
          }
          >
            {format(timestamp, 'MMM d, HH:mm')}
          </div>
        )
      }
    </div>
  </div>
)
