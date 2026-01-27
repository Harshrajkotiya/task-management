const Table = ({ columns, data, keyExtractor = (item) => item.id, emptyMessage = "No data found." }) => {
    return (
        <div className="bg-white rounded-3xl border border-[#E6E6E6] overflow-hidden p-4">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[#9CA3AF] border-b border-[#E6E6E6] border-dashed py-2">
                            {columns.map((col, index) => (
                                <th key={index} className={`pb-2 px-4 text-sm !font-light ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {data && data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={keyExtractor(row) || rowIndex}
                                    className="border-b border-[#E6E6E6] group"
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className={`text-sm py-3 px-4 !font-[400] ${col.cellClassName || ''}`}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(row)
                                                : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="py-20 text-center text-gray-300 font-bold"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
