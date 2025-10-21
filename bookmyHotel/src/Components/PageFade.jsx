import React, { useEffect, useState } from 'react';

function PageFade({ children }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setShow(true), 0);
        return () => clearTimeout(id);
    }, []);

    return (
        <div className={`page-fade fade ${show ? 'show' : ''}`}>
            {children}
        </div>
    );
}

export default PageFade;









