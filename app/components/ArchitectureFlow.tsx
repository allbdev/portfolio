'use client';

import { Fragment } from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { fontFamilies } from '../fonts';
import type { Architecture } from '../get-dictionary';

/**
 * A system drawn as a chain of boxes. Runs left to right on wide screens and
 * top to bottom on phones; `compact` always stacks, for use inside a card.
 */
export default function ArchitectureFlow({
  architecture,
  compact = false,
}: {
  architecture: Architecture;
  compact?: boolean;
}) {
  const row = compact ? 'column' : ({ xs: 'column', md: 'row' } as const);

  return (
    <Box>
      <Box
        role="list"
        sx={{
          display: 'flex',
          flexDirection: row,
          alignItems: 'stretch',
          gap: compact ? 0.5 : { xs: 0.5, md: 1 },
        }}
      >
        {architecture.nodes.map((node, index) => (
          <Fragment key={node.label}>
            {index > 0 ? (
              <Box
                aria-hidden
                sx={{
                  alignSelf: 'center',
                  fontFamily: fontFamilies.mono,
                  fontSize: compact ? '0.75rem' : '0.9rem',
                  color: 'accent.text',
                  lineHeight: 1,
                  '& .down': { display: compact ? 'inline' : { xs: 'inline', md: 'none' } },
                  '& .right': { display: compact ? 'none' : { xs: 'none', md: 'inline' } },
                }}
              >
                <span className="down">↓</span>
                <span className="right">→</span>
              </Box>
            ) : null}
            <Box
              role="listitem"
              sx={{
                flex: 1,
                minWidth: 0,
                border: 1,
                borderColor: (theme) => alpha(theme.palette.accent.main, 0.35),
                bgcolor: (theme) => alpha(theme.palette.accent.main, 0.06),
                borderRadius: '10px',
                px: compact ? 1.5 : 1.75,
                py: compact ? 1 : 1.5,
              }}
            >
              <Box
                sx={{
                  fontFamily: fontFamilies.mono,
                  fontSize: compact ? '0.66rem' : '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'accent.text',
                }}
              >
                {node.label}
              </Box>
              {node.items.map((item) => (
                <Box
                  key={item}
                  sx={{
                    mt: 0.5,
                    fontSize: compact ? '0.78rem' : '0.86rem',
                    lineHeight: 1.4,
                    color: 'text.secondary',
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Fragment>
        ))}
      </Box>
      {architecture.note ? (
        <Box
          sx={{
            mt: compact ? 1.25 : 2,
            fontFamily: fontFamilies.mono,
            fontSize: compact ? '0.62rem' : '0.7rem',
            letterSpacing: '0.04em',
            color: 'text.secondary',
          }}
        >
          {architecture.note}
        </Box>
      ) : null}
    </Box>
  );
}
