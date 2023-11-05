import { createRef } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NoteItem from './NoteItem';
import * as propTypes from '../../utils/prop-types';

export default function NoteList({ notes, className }) {
  const classes = twMerge(
    'grid w-[100%] auto-rows-[8px] grid-cols-[repeat(auto-fill,16rem)] xxs:grid-cols-[repeat(auto-fill,20rem)] justify-center gap-4 pb-20',
    className,
  );

  return (
    <TransitionGroup component="ul" className={classes}>
      {notes.map(note => {
        const noteRef = createRef(null);

        // calculating number of grid rows for a note item
        let gapCount = 1;
        let totalPixels = 70; // padding (40px) + actions height (28px) + border (2px)
        if (note?.title) {
          gapCount++;
          totalPixels += 20;
        }
        if (note?.sharedUsers?.length > 0) {
          gapCount++;
          totalPixels += 24;
        }
        if (note?.tags?.length > 0) {
          gapCount++;
          const tagsLength = Math.ceil(note.tags.join().length / 25);
          totalPixels += tagsLength * 24;
        }

        const textContentLength = Math.ceil(note.textContent.length / 40);
        const textContentLineBreaks = note.textContent.split('\n').length;
        const textContentLinesToShow = Math.max(textContentLength, textContentLineBreaks);

        totalPixels += textContentLinesToShow <= 6 ? textContentLinesToShow * 20 : 120;
        totalPixels += gapCount * 12;
        const totalSpans = Math.ceil((totalPixels + 16) / 24);

        const style = { gridRowEnd: `span ${totalSpans}` };

        return (
          <CSSTransition key={note.id} nodeRef={noteRef} appear={true} timeout={400} classNames="fade" unmountOnExit>
            <NoteItem note={note} style={style} ref={noteRef} />
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
}

NoteList.propTypes = {
  notes: PropTypes.arrayOf(propTypes.note),
  className: PropTypes.string,
};
