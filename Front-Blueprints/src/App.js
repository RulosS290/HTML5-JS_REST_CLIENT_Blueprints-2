import React, { useState } from 'react';
import BlueprintList from './components/BlueprintList';
import BlueprintDetail from './components/BlueprintDetail';

const App = () => {
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [selectedBlueprint, setSelectedBlueprint] = useState('');

    return (
        <div>
            <BlueprintList setSelectedAuthor={setSelectedAuthor} setSelectedBlueprint={setSelectedBlueprint} />
            {selectedBlueprint && <BlueprintDetail author={selectedAuthor} blueprintName={selectedBlueprint} />}
        </div>
    );
};

export default App;
