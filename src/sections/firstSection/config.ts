export type Piece = 'Header' | 'Nav' | 'Card' | 'Button' | 'Footer'

/**
 * Correct composition sequence: what the target mock in the Preview panel
 * looks like. `Nav` and `Footer` are distractors that don't belong.
 */
export const ORDER: Piece[] = ['Header', 'Card', 'Button']

export const PALETTE: Piece[] = ['Header', 'Nav', 'Card', 'Button', 'Footer']

export const PIECE_META: Record<Piece, { color: string; hint: string; shape: string }> = {
  Header: { color: '#61dafb', hint: 'Shows the title',    shape: '▬▬▬▬▬' },
  Nav:    { color: '#c084fc', hint: 'Menu links',         shape: '• • •'  },
  Card:   { color: '#c084fc', hint: 'Wraps some content', shape: '▢▢▢'    },
  Button: { color: '#7cf9c2', hint: 'Users click it',     shape: '⬤'      },
  Footer: { color: '#ffd166', hint: 'Bottom info',        shape: '─────'  },
}
